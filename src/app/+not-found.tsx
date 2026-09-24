import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EmptyState } from '@/components';
import { colors } from '@/lib';

export default function NotFoundScreen() {
  return (
    <EmptyState
      title="Page introuvable"
      description="La page que vous cherchez n’existe pas."
      action={
        <Link href="/" dismissTo style={styles.link}>
          Aller aux messages
        </Link>
      }
    />
  );
}

const styles = StyleSheet.create({
  link: {
    fontWeight: '500',
    color: colors.brand,
  },
});
