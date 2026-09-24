import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/lib';

// Screens draw their own header, so the stack header is hidden and the safe area is handled once here.
export function RootNavigator() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
