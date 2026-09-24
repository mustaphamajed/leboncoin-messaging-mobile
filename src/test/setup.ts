import AsyncStorage from '@react-native-async-storage/async-storage';
import { onlineManager } from '@tanstack/react-query';

import { resetDb } from './msw/db';
import { server } from './msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(async () => {
  server.resetHandlers();
  resetDb();
  await AsyncStorage.clear();
  onlineManager.setOnline(true);
});

afterAll(() => {
  server.close();
});
