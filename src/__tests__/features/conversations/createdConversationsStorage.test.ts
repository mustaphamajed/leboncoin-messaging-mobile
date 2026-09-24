import AsyncStorage from '@react-native-async-storage/async-storage';

import { mergeCreatedConversations, rememberCreatedConversation } from '@/features/conversations';
import { conversations } from '@/test/fixtures';

const created = { ...conversations[0], id: 10, recipientId: 3, recipientNickname: 'Patrick' };
const storageKey = 'lbc:created-conversations:1';

describe('createdConversationsStorage', () => {
  it('adds remembered conversations missing from the server response', async () => {
    await rememberCreatedConversation(1, created);

    await expect(mergeCreatedConversations(1, conversations)).resolves.toEqual([...conversations, created]);
  });

  it('forgets a conversation once the server returns it', async () => {
    await rememberCreatedConversation(1, created);

    await expect(mergeCreatedConversations(1, [...conversations, created])).resolves.toEqual([
      ...conversations,
      created,
    ]);
    await expect(AsyncStorage.getItem(storageKey)).resolves.toBeNull();
  });

  it('keeps conversations of each user separate', async () => {
    await rememberCreatedConversation(1, created);

    await expect(mergeCreatedConversations(2, [])).resolves.toEqual([]);
  });

  it.each([
    ['corrupted JSON', '{not json'],
    ['unexpected data', JSON.stringify([{ id: 'x' }])],
  ])('ignores %s in storage', async (_, value) => {
    await AsyncStorage.setItem(storageKey, value);

    await expect(mergeCreatedConversations(1, conversations)).resolves.toEqual(conversations);
  });
});
