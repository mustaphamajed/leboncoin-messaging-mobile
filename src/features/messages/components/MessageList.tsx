import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, Spinner } from '@/components';
import type { User } from '@/services';
import { useMessages } from '../hooks/useMessages';
import { useOutgoingMessages } from '../hooks/useOutgoingMessages';
import { useStickToBottom } from '../hooks/useStickToBottom';
import { buildTimeline, type TimelineItem } from '../timeline';
import { DayLabel } from './DayLabel';
import { MessageBubble } from './MessageBubble';

const NEAR_LATEST_THRESHOLD = 80;

interface MessageListProps {
  conversationId: number;
  currentUserId: User['id'];
  participant: User;
}

export function MessageList({ conversationId, currentUserId, participant }: MessageListProps) {
  const { data: messages, error, isPending, isError, isSuccess, refetch, isFetching } = useMessages(conversationId);
  const { outgoingMessages, retry, discard } = useOutgoingMessages(conversationId);
  const timeline = buildTimeline(messages ?? [], outgoingMessages, currentUserId);
  // Newest first, for the inverted list.
  const latestFirst = [...timeline].reverse();
  const listRef = useStickToBottom<TimelineItem>(outgoingMessages.length);

  return (
    <>
      {isPending && <Spinner label="Chargement des messages" style={styles.fill} />}

      {isError && (
        <ErrorState
          title="Messages indisponibles"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          style={[styles.fill, styles.centered]}
        />
      )}

      {isSuccess && timeline.length === 0 && (
        <EmptyState title="Aucun message pour le moment" description={`Dites bonjour à ${participant.nickname} !`} />
      )}

      {timeline.length > 0 && (
        <FlatList
          ref={listRef}
          accessibilityLabel={`Messages avec ${participant.nickname}`}
          // Inverted so the list opens on the latest message and new messages appear at the bottom.
          inverted
          data={latestFirst}
          keyExtractor={(item) => item.key}
          // Keeps the reading position when messages arrive, unless the user is already near the latest one.
          maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: NEAR_LATEST_THRESHOLD }}
          renderItem={({ item: { outgoing, ...item } }) => (
            <View>
              {item.startsNewDay && <DayLabel timestamp={item.timestamp} />}
              <MessageBubble
                body={item.body}
                timestamp={item.timestamp}
                status={item.status}
                isOwn={item.isOwn}
                authorName={item.isOwn ? 'Vous' : participant.nickname}
                showAuthor={item.showAuthor}
                onRetry={outgoing && (() => retry(outgoing))}
                onDiscard={outgoing && (() => discard(outgoing.mutationId))}
              />
            </View>
          )}
          contentContainerStyle={styles.content}
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
