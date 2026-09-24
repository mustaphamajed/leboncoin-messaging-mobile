import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/lib';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    backgroundColor: colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pressed: {
    backgroundColor: colors.brandDark,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
});
