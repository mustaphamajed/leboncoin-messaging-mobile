import { StyleSheet, Text } from 'react-native';

import { colors, formatDayLabel } from '@/lib';

export function DayLabel({ timestamp }: { timestamp: number }) {
  return <Text style={styles.label}>{formatDayLabel(timestamp)}</Text>;
}

const styles = StyleSheet.create({
  label: {
    alignSelf: 'center',
    marginVertical: 8,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
