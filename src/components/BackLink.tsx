import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';

export function BackLink() {
  return (
    <Link href="/" dismissTo asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Retour aux conversations" hitSlop={8}>
        {({ pressed }) => (
          <View style={[styles.back, pressed && styles.pressed]}>
            <Text style={styles.icon}>‹</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
  icon: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
  },
});
