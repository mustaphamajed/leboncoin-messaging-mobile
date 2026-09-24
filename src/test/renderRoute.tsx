import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import { ExpoRoot, usePathname } from 'expo-router';
import { getMockContext } from 'expo-router/testing-library';
import { useEffect } from 'react';

import NotFoundScreen from '@/app/+not-found';
import ConversationScreen from '@/app/conversations/[conversationId]';
import NewConversationScreen from '@/app/conversations/new';
import ConversationsScreen from '@/app/index';
import { RootNavigator } from '@/navigation';
import { AppProviders } from '@/providers';

interface RenderRouteOptions {
  userId?: number;
}

// Renders the real screens under the real navigator, with a query client that does not retry.
// expo-router's renderRouter is not used because it switches to fake timers, which freeze MSW, axios and React Query.
export async function renderRoute(path: string, { userId = 1 }: RenderRouteOptions = {}) {
  const queryClient = new QueryClient({
    // gcTime: Infinity schedules no garbage collection timers, so nothing keeps Jest running after the tests.
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } },
  });
  const location = { pathname: path };

  function TestLayout() {
    const pathname = usePathname();

    useEffect(() => {
      location.pathname = pathname;
    }, [pathname]);

    return (
      <AppProviders queryClient={queryClient} userId={userId}>
        <RootNavigator />
      </AppProviders>
    );
  }

  const context = getMockContext({
    _layout: TestLayout,
    index: ConversationsScreen,
    'conversations/[conversationId]': ConversationScreen,
    'conversations/new': NewConversationScreen,
    '+not-found': NotFoundScreen,
  });

  // Load the route components synchronously, as renderRouter does.
  process.env.EXPO_ROUTER_IMPORT_MODE = 'sync';
  const { unmount } = await render(<ExpoRoot context={context} location={path} />);

  return { queryClient, unmount, getPathname: () => location.pathname };
}
