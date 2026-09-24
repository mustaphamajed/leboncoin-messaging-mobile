import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, Spinner } from '@/components';
import type { User } from '@/services';
import { useMessages } from '../hooks/useMessages';
import { useOutgoingMessages } from '../hooks/useOutgoingMessages';
import { useStickToBottom } from '../hooks/useStickToBottom';
import { buildTimeline, type TimelineItem } from '../timeline';
import { DayLabel } from './DayLabel';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  conversationId: number;
  currentUserId: User['id'];
  participant: User;
}

export function MessageList({ conversationId, currentUserId, participant }: MessageListProps) {
  const { data: messages, error, isPending, isError, isSuccess, refetch, isFetching } = useMessages(conversationId);
  const { outgoingMessages, retry, discard } = useOutgoingMessages(conversationId);
  const timeline = useMemo(
    () => buildTimeline(messages ?? [], outgoingMessages, currentUserId),
    [messages, outgoingMessages, currentUserId],
  );
  const { listRef, onScroll, onContentSizeChange } = useStickToBottom<TimelineItem>(outgoingMessages.length);

  return (
    <>
      {isPending && <Spinner label="Loading messages" style={styles.fill} />}

      {isError && (
        <ErrorState
          title="Messages unavailable"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          style={[styles.fill, styles.centered]}
        />
      )}

      {isSuccess && timeline.length === 0 && (
        <EmptyState title="No messages yet" description={`Say hello to ${participant.nickname}!`} />
      )}

      {timeline.length > 0 && (
        <FlatList
          ref={listRef}
          accessibilityLabel={`Messages with ${participant.nickname}`}
          data={timeline}
          keyExtractor={(item) => item.key}
          renderItem={({ item: { outgoing, ...item } }) => (
            <View>
              {item.startsNewDay && <DayLabel timestamp={item.timestamp} />}
              <MessageBubble
                body={item.body}
                timestamp={item.timestamp}
                status={item.status}
                isOwn={item.isOwn}
                authorName={item.isOwn ? 'You' : participant.nickname}
                showAuthor={item.showAuthor}
                onRetry={outgoing && (() => retry(outgoing))}
                onDiscard={outgoing && (() => discard(outgoing.mutationId))}
              />
            </View>
          )}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={onContentSizeChange}
        />
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
  content: {
    gap: 8,
    padding: 16,
  },
});
