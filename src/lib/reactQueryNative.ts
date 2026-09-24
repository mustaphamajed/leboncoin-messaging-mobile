import { focusManager, onlineManager } from '@tanstack/react-query';
import { addNetworkStateListener } from 'expo-network';
import { AppState, Platform } from 'react-native';

export function setupReactQueryForNative() {
  onlineManager.setEventListener((setOnline) => {
    const subscription = addNetworkStateListener((state) => setOnline(state.isConnected !== false));
    return () => subscription.remove();
  });

  const subscription = AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
  });
  return () => subscription.remove();
}
