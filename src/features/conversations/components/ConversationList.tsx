import { Link } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, Spinner } from '@/components';
import { useCurrentUserId } from '@/context';
import { colors } from '@/lib';
import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';

export function ConversationList() {
  const currentUserId = useCurrentUserId();
  const {
    data: conversations = [],
    error,
    isPending,
    isError,
    isSuccess,
    refetch,
    isFetching,
    isRefetching,
  } = useConversations();
  return (
    <>
      {isPending && <Spinner label="Chargement des conversations" />}

      {isError && (
        <ErrorState
          title="Conversations indisponibles"
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      )}

      {isSuccess && conversations.length === 0 && (
        <EmptyState
          title="Aucune conversation pour le moment"
          description="Vos conversations avec les autres utilisateurs apparaîtront ici."
          action={
            <Link href="/conversations/new" style={styles.link}>
              Démarrer une conversation
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
