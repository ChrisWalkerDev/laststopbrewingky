import type { ApiProblem, HealthResponse } from '@laststop/contracts';

export interface Env {
  readonly ENVIRONMENT: string;
  readonly ALLOWED_ORIGINS: string;
}

const allowedMethods = 'GET, HEAD, OPTIONS';

function allowedOrigins(environment: Env): ReadonlySet<string> {
  return new Set(
    environment.ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function securityHeaders(origin?: string): Headers {
  const headers = new Headers({
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  return headers;
}

function json(body: unknown, init: ResponseInit, origin?: string): Response {
  const headers = securityHeaders(origin);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');

  for (const [name, value] of new Headers(init.headers)) {
    headers.set(name, value);
  }

  return new Response(JSON.stringify(body), { ...init, headers });
}

function problem(status: number, title: string, detail: string, origin?: string): Response {
  const body: ApiProblem = {
    type: 'about:blank',
    title,
    status,
    detail,
  };
  return json(body, { status }, origin);
}

function corsPreflight(request: Request, environment: Env): Response {
  const origin = request.headers.get('Origin');
  if (!origin || !allowedOrigins(environment).has(origin)) {
    return problem(403, 'Origin not allowed', 'The request origin is not permitted.');
  }

  const headers = securityHeaders(origin);
  headers.set('Access-Control-Allow-Methods', allowedMethods);
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Access-Control-Max-Age', '86400');
  return new Response(null, { status: 204, headers });
}

export default {
  fetch(request: Request, environment: Env): Response {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get('Origin');
    const responseOrigin =
      requestOrigin && allowedOrigins(environment).has(requestOrigin) ? requestOrigin : undefined;

    if (request.method === 'OPTIONS') {
      return corsPreflight(request, environment);
    }

    if (url.pathname !== '/api/health') {
      return problem(
        404,
        'Not found',
        'The requested API resource does not exist.',
        responseOrigin,
      );
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json(
        {
          type: 'about:blank',
          title: 'Method not allowed',
          status: 405,
          detail: 'Use a method listed in the Allow header.',
        } satisfies ApiProblem,
        { status: 405, headers: { Allow: allowedMethods } },
        responseOrigin,
      );
    }

    const body: HealthResponse = {
      ok: true,
      service: 'laststopbrewingky-api',
      environment: environment.ENVIRONMENT,
    };
    const response = json(body, { status: 200 }, responseOrigin);
    return request.method === 'HEAD'
      ? new Response(null, { status: response.status, headers: response.headers })
      : response;
  },
} satisfies ExportedHandler<Env>;
