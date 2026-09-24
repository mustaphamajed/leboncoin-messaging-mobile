import AsyncStorage from '@react-native-async-storage/async-storage';

import { type Conversation, conversationListSchema } from '@/services';

const storageKey = (userId: number) => `lbc:created-conversations:${userId}`;

async function read(userId: number): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const result = conversationListSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

async function write(userId: number, conversations: Conversation[]) {
  try {
    if (conversations.length === 0) await AsyncStorage.removeItem(storageKey(userId));
    else await AsyncStorage.setItem(storageKey(userId), JSON.stringify(conversations));
  } catch {
    // Storage can fail (full disk): the conversation then only lives in memory.
  }
}

export async function rememberCreatedConversation(userId: number, conversation: Conversation) {
  const stored = (await read(userId)).filter(({ id }) => id !== conversation.id);
  await write(userId, [...stored, conversation]);
}

export async function mergeCreatedConversations(userId: number, fromServer: Conversation[]): Promise<Conversation[]> {
  const serverIds = new Set(fromServer.map(({ id }) => id));
  const stored = await read(userId);
  const notYetOnServer = stored.filter(({ id }) => !serverIds.has(id));

  if (notYetOnServer.length !== stored.length) await write(userId, notYetOnServer);

  return [...fromServer, ...notYetOnServer];
}
