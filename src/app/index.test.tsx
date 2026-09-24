import { render, screen } from '@testing-library/react-native';

import HomeScreen from './index';

test('renders the messages title', async () => {
  await render(<HomeScreen />);
  expect(screen.getByText('Messages')).toBeOnTheScreen();
});
