import { Link, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@/lib';

interface TextLinkProps {
  href: Href;
  // Goes back to the screen if it is already in the history, instead of stacking a new one.
  dismissTo?: boolean;
  children: ReactNode;
}

export function TextLink({ href, dismissTo, children }: TextLinkProps) {
  return (
    <Link href={href} dismissTo={dismissTo} style={styles.link}>
      {children}
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    fontWeight: '500',
    color: colors.brand,
  },
});
