import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/lib';

interface SpinnerProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Spinner({ label = 'Loading', style }: SpinnerProps) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} style={[styles.container, style]}>
      <ActivityIndicator color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
