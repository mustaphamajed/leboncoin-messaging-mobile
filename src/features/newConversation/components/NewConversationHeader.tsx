import { StyleSheet, Text, View } from 'react-native';

import { BackLink } from '@/components';
import { colors } from '@/lib';

export function NewConversationHeader() {
  return (
    <View style={styles.header}>
      <BackLink />
      <Text accessibilityRole="header" style={styles.title}>
        Nouvelle conversation
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
