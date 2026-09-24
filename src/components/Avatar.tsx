import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';

const COLORS = ['#ea580c', '#0369a1', '#047857', '#7c3aed', '#e11d48', '#0f766e'];

const SIZES = {
  md: { box: 40, fontSize: 16 },
  lg: { box: 48, fontSize: 18 },
};

interface AvatarProps {
  id: number;
  name: string;
  size?: keyof typeof SIZES;
}

export function Avatar({ id, name, size = 'md' }: AvatarProps) {
  const { box, fontSize } = SIZES[size];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.avatar, { width: box, height: box, backgroundColor: COLORS[id % COLORS.length] }]}
    >
      <Text style={[styles.initial, { fontSize }]}>{name.trim().charAt(0).toUpperCase() || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  initial: {
    fontWeight: '600',
    color: colors.white,
  },
});
