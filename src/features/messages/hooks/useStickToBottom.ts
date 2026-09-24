import { useEffect, useRef } from 'react';
import type { FlatList } from 'react-native';

// The message list is inverted, so offset 0 is the latest message.
// Sending a message always scrolls down to it, wherever the user was.
export function useStickToBottom<TItem>(ownContentCount: number) {
  const listRef = useRef<FlatList<TItem>>(null);
  const previousOwnContentCountRef = useRef(ownContentCount);

  useEffect(() => {
    if (ownContentCount > previousOwnContentCountRef.current) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
    previousOwnContentCountRef.current = ownContentCount;
  }, [ownContentCount]);

  return listRef;
}
