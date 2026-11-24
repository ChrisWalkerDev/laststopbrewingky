import { validateRuntimeConfig } from './runtime-config';

describe('runtime contact configuration', () => {
  const local = {
    apiBaseUrl: '/api',
    environment: 'local',
    contact: {
      mode: 'mock',
      endpoint: '',
    },
  };

  it('accepts the local mock configuration', () => {
    expect(validateRuntimeConfig(local)).toEqual(local);
  });

  it('rejects a production mock configuration', () => {
    expect(() =>
      validateRuntimeConfig({
        ...local,
        environment: 'production',
      }),
    ).toThrow('must use HTTP');
  });

  it('requires an absolute HTTPS endpoint for HTTP mode', () => {
    expect(() =>
      validateRuntimeConfig({
        ...local,
        environment: 'production',
        contact: { mode: 'http', endpoint: '/contact' },
      }),
    ).toThrow('absolute endpoint');

    expect(() =>
      validateRuntimeConfig({
        ...local,
        environment: 'production',
        contact: { mode: 'http', endpoint: 'http://api.example.test/contact' },
      }),
    ).toThrow('HTTPS endpoint');
  });

  it('accepts a configured external production endpoint', () => {
    const production = {
      ...local,
      environment: 'production',
      contact: { mode: 'http', endpoint: 'https://api.example.test/contact' },
    };

    expect(validateRuntimeConfig(production)).toEqual(production);
  });
});
