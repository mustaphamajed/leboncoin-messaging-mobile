import { StyleSheet, Text, View } from 'react-native';

import { ConversationList } from '@/features/conversations';
import { colors } from '@/lib';

export default function ConversationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Conversations
        </Text>
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
});
