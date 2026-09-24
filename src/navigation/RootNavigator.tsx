import { Stack } from 'expo-router';

import { colors } from '@/lib';

export function RootNavigator() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.brand,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen
        name="conversations/[conversationId]"
        options={{ title: "Conversation" }}
      />
    </Stack>
  );
}
