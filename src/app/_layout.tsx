import { RootNavigator } from '@/navigation';
import { AppProviders } from '@/providers';

export { RouteErrorBoundary as ErrorBoundary } from '@/components';

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
