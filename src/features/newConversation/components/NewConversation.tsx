import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState, ErrorState, Spinner } from '@/components';
import { useCurrentUserId } from '@/context';
import { useConversations } from '@/features/conversations';
import { colors, getErrorMessage, getOtherParticipant } from '@/lib';
import type { User } from '@/services';
import { useCreateConversation } from '../hooks/useCreateConversation';
import { useUsers } from '../hooks/useUsers';
import { NewConversationHeader } from './NewConversationHeader';
import { UserOption } from './UserOption';

export function NewConversation() {
  const currentUserId = useCurrentUserId();
  const [search, setSearch] = useState('');
  const users = useUsers();
  const conversations = useConversations();
  const createConversation = useCreateConversation();

  const conversationIdByParticipant = new Map(
    (conversations.data ?? []).map((conversation) => [
      getOtherParticipant(conversation, currentUserId).id,
      conversation.id,
    ]),
  );

  const query = search.trim().toLocaleLowerCase();
  const candidates = (users.data ?? [])
    .filter((user) => user.id !== currentUserId && user.nickname.toLocaleLowerCase().includes(query))
    .sort((a, b) => a.nickname.localeCompare(b.nickname));

  const currentUser = users.data?.find(({ id }) => id === currentUserId);
  const isLoading = users.isPending || conversations.isPending;
  const hasLoadError = !isLoading && (users.isError || conversations.isError);
  const isReady = users.isSuccess && conversations.isSuccess;

  // Replace rather than push, so going back from the conversation returns to the list.
  const openConversation = (conversationId: number) => router.replace(`/conversations/${conversationId}`);

  const startConversation = (recipient: User) => {
    const existingConversationId = conversationIdByParticipant.get(recipient.id);

    if (existingConversationId) {
      openConversation(existingConversationId);
    } else if (currentUser) {
      createConversation.mutate(
        {
          senderId: currentUser.id,
          senderNickname: currentUser.nickname,
          recipientId: recipient.id,
          recipientNickname: recipient.nickname,
        },
        { onSuccess: (conversation) => openConversation(conversation.id) },
      );
    }
  };

  return (
    <View style={styles.container}>
      <NewConversationHeader />

      <View style={styles.searchContainer}>
        <TextInput
          accessibilityLabel="Search users"
          value={search}
          onChangeText={setSearch}
          placeholder="Search users"
          placeholderTextColor={colors.textSubtle}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={styles.search}
        />
      </View>

      {createConversation.isError && (
        <Text accessibilityRole="alert" style={styles.alert}>
          Could not start the conversation. {getErrorMessage(createConversation.error)}
        </Text>
      )}

      {isLoading && <Spinner label="Loading users" />}

      {hasLoadError && (
        <ErrorState
          title="Users unavailable"
          error={users.error ?? conversations.error}
          onRetry={() => {
            void users.refetch();
            void conversations.refetch();
          }}
          isRetrying={users.isFetching || conversations.isFetching}
        />
      )}

      {isReady && !currentUser && (
        <EmptyState title="Profile unavailable" description="We could not find your profile. Please try again later." />
      )}

      {isReady && currentUser && candidates.length === 0 && (
        <EmptyState title="No user found" description={`No user matches “${search.trim()}”.`} />
      )}

      {isReady && currentUser && candidates.length > 0 && (
        <FlatList
          data={candidates}
          keyExtractor={(user) => String(user.id)}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: user }) => (
            <UserOption
              user={user}
              hasConversation={conversationIdByParticipant.has(user.id)}
              isStarting={createConversation.isPending && createConversation.variables?.recipientId === user.id}
              disabled={createConversation.isPending}
              onSelect={startConversation}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
  },
  alert: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: colors.dangerBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.danger,
  },
});
