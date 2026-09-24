import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';

export default function ConversationsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Messages' }} />
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Conversations
        </Text>
      </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
