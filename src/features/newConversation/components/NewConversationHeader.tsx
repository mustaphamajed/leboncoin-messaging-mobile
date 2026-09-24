import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';

export function NewConversationHeader() {
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
      <Text accessibilityRole="header" style={styles.title}>
        New conversation
      </Text>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
