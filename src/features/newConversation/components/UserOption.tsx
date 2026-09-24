import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components';
import { colors } from '@/lib';
import type { User } from '@/services';

interface UserOptionProps {
  user: User;
  hasConversation: boolean;
  isStarting: boolean;
  disabled: boolean;
  onSelect: (user: User) => void;
}

export function UserOption({ user, hasConversation, isStarting, disabled, onSelect }: UserOptionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isStarting }}
      onPress={() => onSelect(user)}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={[styles.option, pressed && styles.pressed, disabled && styles.disabled]}>
          <Avatar id={user.id} name={user.nickname} />
          <Text numberOfLines={1} style={styles.nickname}>
            {user.nickname}
          </Text>
          {isStarting && <Text style={styles.hint}>Création…</Text>}
          {!isStarting && hasConversation && <Text style={styles.hint}>Ouvrir la conversation</Text>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
  disabled: {
    opacity: 0.6,
  },
  nickname: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
