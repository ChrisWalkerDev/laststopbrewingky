import { mkdir, readFile, writeFile } from 'node:fs/promises';

const outputFile = new URL('../dist/web/browser/app-config.json', import.meta.url);
const outputDirectory = new URL('../dist/web/browser/', import.meta.url);
const buildBranch = process.env.WORKERS_CI_BRANCH ?? process.env.CF_PAGES_BRANCH;
const environment =
  process.env.APP_ENVIRONMENT ?? (buildBranch === 'main' ? 'production' : 'preview');
const apiBaseUrl = process.env.APP_API_BASE_URL ?? '/api';
const contactEndpoint = process.env.APP_CONTACT_ENDPOINT ?? '';
const siteUrl = process.env.APP_SITE_URL;

if (!['preview', 'production'].includes(environment)) {
  throw new Error('APP_ENVIRONMENT must be preview or production for Cloudflare builds.');
}

new URL(apiBaseUrl, 'https://configuration.invalid');
const contactUrl = contactEndpoint ? new URL(contactEndpoint) : undefined;
if (contactUrl && contactUrl.protocol !== 'https:') {
  throw new Error('APP_CONTACT_ENDPOINT must use HTTPS.');
}
if (environment === 'production' && (!contactUrl || contactUrl.origin === 'null')) {
  throw new Error(
    'APP_CONTACT_ENDPOINT is required for production and must be an absolute HTTPS URL.',
  );
}
if (siteUrl) {
  const parsedSiteUrl = new URL(siteUrl);
  if (parsedSiteUrl.protocol !== 'https:') {
    throw new Error('APP_SITE_URL must use HTTPS.');
  }
}
const canonicalSiteUrl = environment === 'production' ? siteUrl : undefined;

if (siteUrl && environment === 'preview') {
  console.log('APP_SITE_URL is ignored for preview builds to prevent preview indexing.');
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  outputFile,
  `${JSON.stringify(
    {
      apiBaseUrl,
      environment,
      contact: {
        mode: environment === 'production' ? 'http' : 'mock',
        endpoint: environment === 'production' ? contactEndpoint : '',
      },
      ...(canonicalSiteUrl ? { siteUrl: canonicalSiteUrl } : {}),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

if (canonicalSiteUrl) {
  const routes = ['/', '/beers', '/menu', '/about', '/visit', '/contact'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${new URL(route, canonicalSiteUrl).toString()}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(new URL('sitemap.xml', outputDirectory), sitemap, 'utf8');
  await writeFile(
    new URL('robots.txt', outputDirectory),
    `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', canonicalSiteUrl).toString()}\n`,
    'utf8',
  );
} else {
  await writeFile(
    new URL('robots.txt', outputDirectory),
    environment === 'preview' ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n',
    'utf8',
  );
}

if (environment === 'production' && contactUrl) {
  const headersFile = new URL('../dist/web/browser/_headers', import.meta.url);
  const headers = await readFile(headersFile, 'utf8');
  const updatedHeaders = headers.replace(
    "connect-src 'self';",
    `connect-src 'self' ${contactUrl.origin};`,
  );
  if (updatedHeaders === headers) {
    throw new Error('Unable to add the configured contact API origin to the asset CSP.');
  }
  await writeFile(headersFile, updatedHeaders, 'utf8');
}

console.log(`Runtime configuration written for ${environment}.`);
