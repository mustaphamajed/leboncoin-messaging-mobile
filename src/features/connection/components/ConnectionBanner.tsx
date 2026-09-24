import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';
import { useApiHealth } from '../hooks/useApiHealth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const BANNERS = {
  offline: {
    style: { backgroundColor: colors.offlineBackground, color: colors.white },
    message: 'You are offline. Your messages will be sent as soon as you are back online.',
  },
  degraded: {
    style: { backgroundColor: colors.warningBackground, color: colors.warning },
    message: 'Our servers are having a hiccup. We keep retrying in the background, nothing is lost.',
  },
};

export function ConnectionBanner() {
  const isOnline = useOnlineStatus();
  const apiHealth = useApiHealth();
  const banner = !isOnline ? BANNERS.offline : apiHealth === 'degraded' ? BANNERS.degraded : null;

  return (
    <View accessibilityLabel="Connection status" accessibilityLiveRegion="polite">
      {banner && <Text style={[styles.banner, banner.style]}>{banner.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
