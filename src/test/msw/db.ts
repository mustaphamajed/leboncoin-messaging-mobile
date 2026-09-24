import { conversations, messages, users } from '../fixtures';

const createDb = () => ({
  conversations: structuredClone(conversations),
  messages: structuredClone(messages),
  users: structuredClone(users),
});

export let db = createDb();

export const resetDb = () => {
  db = createDb();
};

export const nextId = (items: { id: number }[]) => Math.max(0, ...items.map(({ id }) => id)) + 1;
