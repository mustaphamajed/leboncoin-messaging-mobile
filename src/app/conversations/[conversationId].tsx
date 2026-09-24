import { useLocalSearchParams } from 'expo-router';

import { ConversationNotFound, ConversationView } from '@/features/messages';
import { idSchema } from '@/services';

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const parsedId = idSchema.safeParse(Number(conversationId));

  return parsedId.success ? (
    <ConversationView key={parsedId.data} conversationId={parsedId.data} />
  ) : (
    <ConversationNotFound />
  );
}
