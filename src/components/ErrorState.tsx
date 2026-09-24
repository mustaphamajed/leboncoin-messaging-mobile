import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, getErrorMessage } from '@/lib';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  error: unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({ title, error, onRetry, isRetrying = false, style }: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{getErrorMessage(error)}</Text>
      {onRetry && (
        <View style={styles.action}>
          <Button label={isRetrying ? 'Nouvelle tentative…' : 'Réessayer'} onPress={onRetry} disabled={isRetrying} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 16,
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
