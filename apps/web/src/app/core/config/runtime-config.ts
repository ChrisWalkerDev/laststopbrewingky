import { InjectionToken } from '@angular/core';

export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly contact: ContactRuntimeConfig;
  readonly environment: 'local' | 'preview' | 'production';
  readonly siteUrl?: string;
}

export interface ContactRuntimeConfig {
  readonly mode: 'mock' | 'http';
  readonly endpoint: string;
  readonly mockFailure?: boolean;
}

export const APP_CONFIG = new InjectionToken<RuntimeConfig>('APP_CONFIG');

function isRuntimeConfig(value: unknown): value is RuntimeConfig {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const contact = candidate['contact'];
  return (
    typeof candidate['apiBaseUrl'] === 'string' &&
    candidate['apiBaseUrl'].length > 0 &&
    typeof contact === 'object' &&
    contact !== null &&
    ((contact as Record<string, unknown>)['mode'] === 'mock' ||
      (contact as Record<string, unknown>)['mode'] === 'http') &&
    typeof (contact as Record<string, unknown>)['endpoint'] === 'string' &&
    ((contact as Record<string, unknown>)['mockFailure'] === undefined ||
      typeof (contact as Record<string, unknown>)['mockFailure'] === 'boolean') &&
    (candidate['environment'] === 'local' ||
      candidate['environment'] === 'preview' ||
      candidate['environment'] === 'production') &&
    (candidate['siteUrl'] === undefined || typeof candidate['siteUrl'] === 'string')
  );
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/app-config.json', {
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Runtime configuration returned HTTP ${response.status}.`);
  }

  return validateRuntimeConfig(await response.json());
}

export function validateRuntimeConfig(value: unknown): RuntimeConfig {
  if (!isRuntimeConfig(value)) {
    throw new Error('Runtime configuration is invalid.');
  }

  const apiUrl = new URL(value.apiBaseUrl, window.location.origin);
  if (apiUrl.protocol !== 'http:' && apiUrl.protocol !== 'https:') {
    throw new Error('Runtime API URL must use HTTP or HTTPS.');
  }

  if (value.siteUrl) {
    const siteUrl = new URL(value.siteUrl);
    if (siteUrl.protocol !== 'https:') {
      throw new Error('Runtime site URL must use HTTPS.');
    }
  }

  if (value.environment === 'production' && value.contact.mode !== 'http') {
    throw new Error('Production runtime configuration must use HTTP contact submission.');
  }

  if (value.contact.mode === 'http') {
    let contactUrl: URL;
    try {
      contactUrl = new URL(value.contact.endpoint);
    } catch {
      throw new Error('HTTP contact submission requires an absolute endpoint URL.');
    }
    if (contactUrl.protocol !== 'https:') {
      throw new Error('HTTP contact submission requires an HTTPS endpoint.');
    }
  }

  return value;
}
