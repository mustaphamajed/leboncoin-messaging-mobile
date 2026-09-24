import { useQuery } from '@tanstack/react-query';

import { useCurrentUserId } from '@/context';
import type { Conversation } from '@/services';
import { conversationsQueryOptions } from './useConversations';

export function useConversation(conversationId: number) {
  const userId = useCurrentUserId();
  const selectConversation = (conversations: Conversation[]) =>
    conversations.find(({ id }) => id === conversationId) ?? null;

  return useQuery({ ...conversationsQueryOptions(userId), select: selectConversation });
}
