import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConnectionBanner } from "@/features/connection";
import { colors } from '@/lib';

export function RootNavigator() {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ConnectionBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
