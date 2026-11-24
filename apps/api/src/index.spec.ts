import { describe, expect, it } from 'vitest';
import worker from './index';
import type { Env } from './index';

const environment: Env = {
  ENVIRONMENT: 'test',
  ALLOWED_ORIGINS: 'https://preview.example.test',
};

describe('API worker', () => {
  it('returns the operational health contract securely', async () => {
    const response = worker.fetch(new Request('https://api.example.test/api/health'), environment);

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: 'laststopbrewingky-api',
      environment: 'test',
    });
  });

  it('allows preflight only from an exact configured origin', () => {
    const allowed = worker.fetch(
      new Request('https://api.example.test/api/health', {
        method: 'OPTIONS',
        headers: { Origin: 'https://preview.example.test' },
      }),
      environment,
    );
    const denied = worker.fetch(
      new Request('https://api.example.test/api/health', {
        method: 'OPTIONS',
        headers: { Origin: 'https://malicious.example.test' },
      }),
      environment,
    );

    expect(allowed.status).toBe(204);
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe('https://preview.example.test');
    expect(denied.status).toBe(403);
    expect(denied.headers.has('Access-Control-Allow-Origin')).toBe(false);
  });

  it('returns problem details for unsupported methods', async () => {
    const response = worker.fetch(
      new Request('https://api.example.test/api/health', { method: 'POST' }),
      environment,
    );

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toContain('GET');
    await expect(response.json()).resolves.toMatchObject({
      type: 'about:blank',
      status: 405,
      title: 'Method not allowed',
    });
  });
});
