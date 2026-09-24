import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib';
import { useApiHealth } from '../hooks/useApiHealth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const BANNERS = {
  offline: {
    style: { backgroundColor: colors.offlineBackground, color: colors.white },
    message: 'Vous êtes hors ligne. Vos messages seront envoyés dès le retour de la connexion.',
  },
  degraded: {
    style: { backgroundColor: colors.warningBackground, color: colors.warning },
    message: 'Nos serveurs rencontrent un souci. Nous réessayons en arrière-plan, rien n’est perdu.',
  },
};

export function ConnectionBanner() {
  const isOnline = useOnlineStatus();
  const apiHealth = useApiHealth();
  const banner = !isOnline ? BANNERS.offline : apiHealth === 'degraded' ? BANNERS.degraded : null;

  return (
    <View accessibilityLabel="État de la connexion" accessibilityLiveRegion="polite">
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
