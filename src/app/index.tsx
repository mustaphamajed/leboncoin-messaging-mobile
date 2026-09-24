import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConversationList } from '@/features/conversations';
import { colors } from '@/lib';

export default function ConversationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Conversations
        </Text>
        <Link href="/conversations/new" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Nouvelle conversation" hitSlop={8}>
            {({ pressed }) => (
              <View style={[styles.newConversation, pressed && styles.newConversationPressed]}>
                <Text style={styles.newConversationText}>+ Nouvelle conversation</Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>
      <ConversationList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  newConversation: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newConversationPressed: {
    backgroundColor: colors.brandLight,
  },
  newConversationText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.brand,
  },
});
