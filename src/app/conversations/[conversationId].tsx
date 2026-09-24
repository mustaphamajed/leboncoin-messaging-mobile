import { Stack, useLocalSearchParams } from 'expo-router';

import { useCurrentUserId } from '@/context';
import { useConversation } from '@/features/conversations';
import { getOtherParticipant } from '@/lib';

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const currentUserId = useCurrentUserId();
  const { data: conversation } = useConversation(Number(conversationId));
  const title = conversation ? getOtherParticipant(conversation, currentUserId).nickname : 'Conversation';

  return <Stack.Screen options={{ title }} />;
}
