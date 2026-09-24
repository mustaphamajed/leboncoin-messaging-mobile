import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/lib';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ title, description, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
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
  description: {
    maxWidth: 384,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: 8,
  },
});
