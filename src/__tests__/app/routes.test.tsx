import { fireEvent, screen } from 'expo-router/testing-library';

import { renderRoute } from '@/test/renderRoute';

describe('routes', () => {
  it('shows the conversations on the home screen', async () => {
    const { getPathname } = await renderRoute('/');

    expect(await screen.findByRole('header', { name: 'Conversations' })).toBeOnTheScreen();
    expect(getPathname()).toBe('/');
  });

  it('shows a not found screen for unknown urls and links back to the messages', async () => {
    const { getPathname } = await renderRoute('/unknown');

    await fireEvent.press(await screen.findByText('Go to messages'));

    expect(await screen.findByRole('header', { name: 'Conversations' })).toBeOnTheScreen();
    expect(getPathname()).toBe('/');
  });
});
