import { QueryClient } from '@tanstack/react-query';
import { renderRouter } from 'expo-router/testing-library';

import NotFoundScreen from '@/app/+not-found';
import ConversationsScreen from '@/app/index';
import { RootNavigator } from '@/navigation';
import { AppProviders } from '@/providers';

interface RenderRouteOptions {
  userId?: number;
}

export async function renderRoute(path: string, { userId = 1 }: RenderRouteOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const TestLayout = () => (
    <AppProviders queryClient={queryClient} userId={userId}>
      <RootNavigator />
    </AppProviders>
  );

  const rendered = renderRouter(
    {
      _layout: TestLayout,
      index: ConversationsScreen,
      '+not-found': NotFoundScreen,
    },
    { initialUrl: path },
  );
  const { getPathname, getSegments, getSearchParams } = rendered;
  await rendered;
  jest.useRealTimers();

  return { queryClient, getPathname, getSegments, getSearchParams };
}
