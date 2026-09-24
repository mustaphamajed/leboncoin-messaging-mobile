import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EmptyState } from '@/components';
import { colors } from '@/lib';

export function ConversationNotFound() {
  return (
    <EmptyState
      title="Conversation introuvable"
      description="Cette conversation n’existe pas ou le lien est invalide."
      action={
        <Link href="/" dismissTo style={styles.link}>
          Back to conversations
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
