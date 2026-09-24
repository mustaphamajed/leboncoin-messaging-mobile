import { StyleSheet, View } from 'react-native';

import { ErrorState, Spinner } from '@/components';
import { useCurrentUserId } from '@/context';
import { useConversation } from '@/features/conversations';
import { getOtherParticipant } from '@/lib';
import { ConversationHeader } from './ConversationHeader';
import { useKeyboardInset } from '../hooks/useKeyboardInset';
import { ConversationNotFound } from './ConversationNotFound';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';

export function ConversationView({ conversationId }: { conversationId: number }) {
  const currentUserId = useCurrentUserId();
  const { data: conversation, error, isPending, isError, isSuccess, refetch, isFetching } =
    useConversation(conversationId);
  const participant = conversation && getOtherParticipant(conversation, currentUserId);
  const keyboardInset = useKeyboardInset();

  return (
    <>
      {isPending && <Spinner label="Chargement de la conversation" style={styles.fill} />}

      {isError && (
        <ErrorState
          title="Conversation indisponible"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          style={[styles.fill, styles.centered]}
        />
      )}

      {isSuccess && !conversation && <ConversationNotFound />}

      {conversation && participant && (
        <View style={[styles.fill, { paddingBottom: keyboardInset }]}>
          <ConversationHeader participant={participant} lastMessageTimestamp={conversation.lastMessageTimestamp} />
          <MessageList conversationId={conversation.id} currentUserId={currentUserId} participant={participant} />
          <MessageComposer conversationId={conversation.id} recipientName={participant.nickname} />
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
