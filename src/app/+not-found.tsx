import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EmptyState } from '@/components';
import { colors } from '@/lib';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page not found' }} />
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Link href="/" dismissTo style={styles.link}>
            Go to messages
          </Link>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    fontWeight: '500',
    color: colors.brand,
  },
});
