import { useCallback, useRef } from 'react';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const NEAR_BOTTOM_THRESHOLD = 80;

export function useStickToBottom<TItem>() {
  const listRef = useRef<FlatList<TItem>>(null);
  const isNearBottomRef = useRef(true);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    isNearBottomRef.current = contentSize.height - contentOffset.y - layoutMeasurement.height <= NEAR_BOTTOM_THRESHOLD;
  }, []);

  const onContentSizeChange = useCallback(() => {
    if (isNearBottomRef.current) {
      listRef.current?.scrollToEnd({ animated: false });
    }
  }, []);

  return { listRef, onScroll, onContentSizeChange };
}
