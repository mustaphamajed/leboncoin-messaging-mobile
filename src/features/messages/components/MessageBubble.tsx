import { StyleSheet, Text, View } from 'react-native';

import { colors, formatTime } from '@/lib';

interface MessageBubbleProps {
  body: string;
  timestamp: number;
  authorName: string;
  isOwn: boolean;
  showAuthor: boolean;
}

export function MessageBubble({ body, timestamp, authorName, isOwn, showAuthor }: MessageBubbleProps) {
  const time = formatTime(timestamp);

  return (
    <View
      accessible
      accessibilityLabel={`${isOwn ? 'You' : authorName}: ${body}, ${time}`}
      style={[styles.container, isOwn ? styles.containerOwn : styles.containerOther]}
    >
      {showAuthor && <Text style={styles.author}>{authorName}</Text>}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={isOwn ? styles.bodyOwn : styles.bodyOther}>{body}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
  },
  containerOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  author: {
    marginBottom: 4,
    paddingHorizontal: 12,
    fontSize: 12,
    color: colors.textMuted,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubbleOwn: {
    borderBottomRightRadius: 4,
    backgroundColor: colors.bubbleOwn,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
    backgroundColor: colors.bubbleOther,
  },
  bodyOwn: {
    fontSize: 16,
    color: colors.white,
  },
  bodyOther: {
    fontSize: 16,
    color: colors.text,
  },
  time: {
    marginTop: 4,
    paddingHorizontal: 4,
    fontSize: 12,
    color: colors.textSubtle,
  },
});
