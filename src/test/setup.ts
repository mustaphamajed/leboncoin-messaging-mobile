import { onlineManager } from '@tanstack/react-query';

import { resetDb } from './msw/db';
import { server } from './msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
  onlineManager.setOnline(true);
});

afterAll(() => {
  server.close();
});
