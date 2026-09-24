import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components';
import { colors, formatRelativeDate, getOtherParticipant } from '@/lib';
import type { Conversation } from '@/services';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
}

export function ConversationItem({ conversation, currentUserId }: ConversationItemProps) {
  const participant = getOtherParticipant(conversation, currentUserId);
  const date = formatRelativeDate(conversation.lastMessageTimestamp);

  return (
    <Link href={`/conversations/${conversation.id}`} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${participant.nickname}, ${date}`}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        <Avatar id={participant.id} name={participant.nickname} />
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.nickname}>
            {participant.nickname}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
