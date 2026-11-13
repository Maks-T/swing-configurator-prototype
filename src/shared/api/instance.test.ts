import { afterEach, expect, test } from 'vitest';

import { getApiBaseUrl, setApiBaseUrl } from './instance';

const originalBaseUrl = getApiBaseUrl();

afterEach(() => {
  setApiBaseUrl(originalBaseUrl);
});

test('getApiBaseUrl returns the value set by setApiBaseUrl', () => {
  setApiBaseUrl('https://api.example/v1');

  expect(getApiBaseUrl()).toBe('https://api.example/v1');
});
