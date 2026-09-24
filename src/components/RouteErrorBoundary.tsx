import type { ErrorBoundaryProps } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';
import { Button } from './Button';

// Export it as `ErrorBoundary` from a route file and Expo Router renders it when the route throws.
export function RouteErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Something went wrong
      </Text>
      <Text style={styles.message}>An unexpected error occurred. Trying again usually fixes it.</Text>
      <View style={styles.action}>
        <Button label="Try again" onPress={retry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    maxWidth: 384,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: 8,
  },
});
