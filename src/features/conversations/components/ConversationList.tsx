import { Link } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, Spinner } from '@/components';
import { useCurrentUserId } from '@/context';
import { colors } from '@/lib';
import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';

export function ConversationList() {
  const currentUserId = useCurrentUserId();
  const { data: conversations = [], error, isPending, isError, isSuccess, refetch, isFetching, isRefetching } =
    useConversations();

  return (
    <>
      {isPending && <Spinner label="Loading conversations" />}

      {isError && (
        <ErrorState
          title="Conversations unavailable"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      )}

      {isSuccess && conversations.length === 0 && (
        <EmptyState
          title="No conversations yet"
          description="Your conversations with other users will appear here."
          action={
            <Link href="/conversations/new" style={styles.link}>
              Start a conversation
            </Link>
          }
        />
      )}

      {conversations.length > 0 && (
        <FlatList
          data={conversations}
          keyExtractor={(conversation) => String(conversation.id)}
          renderItem={({ item }) => <ConversationItem conversation={item} currentUserId={currentUserId} />}
          ItemSeparatorComponent={Separator}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.brand} />
          }
        />
      )}
    </>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  link: {
    fontWeight: '500',
    color: colors.brand,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
