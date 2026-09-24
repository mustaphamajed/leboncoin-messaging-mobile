import { StyleSheet, View } from 'react-native';

import { ErrorState, Spinner } from '@/components';
import { useCurrentUserId } from '@/context';
import { useConversation } from '@/features/conversations';
import { getOtherParticipant } from '@/lib';
import { ConversationHeader } from './ConversationHeader';
import { ConversationNotFound } from './ConversationNotFound';
import { MessageList } from './MessageList';

export function ConversationView({ conversationId }: { conversationId: number }) {
  const currentUserId = useCurrentUserId();
  const { data: conversation, error, isPending, isError, isSuccess, refetch, isFetching } =
    useConversation(conversationId);
  const participant = conversation && getOtherParticipant(conversation, currentUserId);

  return (
    <>
      {isPending && <Spinner label="Loading conversation" style={styles.fill} />}

      {isError && (
        <ErrorState
          title="Conversation unavailable"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          style={[styles.fill, styles.centered]}
        />
      )}

      {isSuccess && !conversation && <ConversationNotFound />}

      {conversation && participant && (
        <View style={styles.fill}>
          <ConversationHeader participant={participant} lastMessageTimestamp={conversation.lastMessageTimestamp} />
          <MessageList conversationId={conversation.id} currentUserId={currentUserId} participant={participant} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});
