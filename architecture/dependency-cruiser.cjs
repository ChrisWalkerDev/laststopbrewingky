const { readdirSync } = require('node:fs');
const { resolve } = require('node:path');

const webFeatures = readdirSync(resolve(__dirname, '../apps/web/src/app/features'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const crossFeatureRules = webFeatures.flatMap((feature) =>
  webFeatures
    .filter((candidate) => candidate !== feature)
    .map((targetFeature) => ({
      name: `${feature}-must-not-import-${targetFeature}-internals`,
      severity: 'error',
      from: { path: `^apps/web/src/app/features/${feature}/` },
      to: { path: `^apps/web/src/app/features/${targetFeature}/(?!index\\.ts$)` },
    })),
);

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-web-api-coupling',
      severity: 'error',
      from: { path: '^apps/web/src/' },
      to: { path: '^apps/api/src/' },
    },
    {
      name: 'no-api-web-coupling',
      severity: 'error',
      from: { path: '^apps/api/src/' },
      to: { path: '^apps/web/src/' },
    },
    {
      name: 'shared-must-not-depend-on-features',
      severity: 'error',
      from: { path: '^apps/web/src/app/shared/' },
      to: { path: '^apps/web/src/app/features/' },
    },
    {
      name: 'core-must-not-depend-on-features',
      severity: 'error',
      from: { path: '^apps/web/src/app/core/' },
      to: { path: '^apps/web/src/app/features/' },
    },
    {
      name: 'contracts-must-remain-independent',
      severity: 'error',
      from: { path: '^libs/contracts/src/' },
      to: { path: '^apps/' },
    },
    ...crossFeatureRules,
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: 'node_modules|\\.spec\\.ts$' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
