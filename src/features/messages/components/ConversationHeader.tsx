import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components';
import { colors, formatRelativeDate } from '@/lib';
import type { User } from '@/services';

interface ConversationHeaderProps {
  participant: User;
  lastMessageTimestamp: number;
}

export function ConversationHeader({ participant, lastMessageTimestamp }: ConversationHeaderProps) {
  return (
    <View style={styles.header}>
      <Link href="/" dismissTo asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Back to conversations" hitSlop={8}>
          {({ pressed }) => (
            <View style={[styles.back, pressed && styles.backPressed]}>
              <Text style={styles.backIcon}>‹</Text>
            </View>
          )}
        </Pressable>
      </Link>
      <Avatar id={participant.id} name={participant.nickname} />
      <View style={styles.content}>
        <Text accessibilityRole="header" numberOfLines={1} style={styles.nickname}>
          {participant.nickname}
        </Text>
        <Text style={styles.lastMessage}>Last message {formatRelativeDate(lastMessageTimestamp)}</Text>
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
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  backPressed: {
    backgroundColor: colors.pressed,
  },
  backIcon: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
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
