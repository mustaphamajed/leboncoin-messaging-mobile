import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const findConversationLinks = () => screen.findAllByRole('link', { name: /,/ });

describe('ConversationList', () => {
  it('lists conversations by most recent, named after the other participant', async () => {
    await renderRoute('/');

    const links = await findConversationLinks();

    expect(links.map((link) => link.props.accessibilityLabel)).toEqual([
      expect.stringContaining('Elodie'),
      expect.stringContaining('Jeremie'),
    ]);
  });

  it('opens the conversation on press', async () => {
    const { getPathname } = await renderRoute('/');

    await fireEvent.press(await screen.findByRole('link', { name: /Jeremie/ }));

    await waitFor(() => expect(getPathname()).toBe('/conversations/1'));
    expect(await screen.findByLabelText('Messages with Jeremie')).toBeOnTheScreen();
  });

  it('shows the date of the last message', async () => {
    await renderRoute('/');

    const link = await screen.findByRole('link', { name: /Jeremie/ });

    expect(within(link).getByText('7 juil. 2021')).toBeOnTheScreen();
  });

  it('shows a loading state while fetching', async () => {
    await renderRoute('/');

    expect(screen.getByLabelText('Loading conversations')).toBeOnTheScreen();
    await findConversationLinks();
  });

  it('shows an empty state when the user has no conversation', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json([])));
    await renderRoute('/');

    expect(await screen.findByRole('header', { name: 'No conversations yet' })).toBeOnTheScreen();
  });

  it('shows an error with a retry button when the server fails', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/');

    // The alert container is not an accessibility element (so its button stays focusable), so it is found by its title.
    expect(await screen.findByText('Conversations unavailable')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(await findConversationLinks()).toHaveLength(2);
  });
});
