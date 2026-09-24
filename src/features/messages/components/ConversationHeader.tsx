import { StyleSheet, Text, View } from 'react-native';

import { Avatar, BackLink } from '@/components';
import { colors, formatRelativeDate } from '@/lib';
import type { User } from '@/services';

interface ConversationHeaderProps {
  participant: User;
  lastMessageTimestamp: number;
}

export function ConversationHeader({ participant, lastMessageTimestamp }: ConversationHeaderProps) {
  return (
    <View style={styles.header}>
      <BackLink />
      <Avatar id={participant.id} name={participant.nickname} />
      <View style={styles.content}>
        <Text accessibilityRole="header" numberOfLines={1} style={styles.nickname}>
          {participant.nickname}
        </Text>
        <Text style={styles.lastMessage}>Dernier message : {formatRelativeDate(lastMessageTimestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  content: {
    flexShrink: 1,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
