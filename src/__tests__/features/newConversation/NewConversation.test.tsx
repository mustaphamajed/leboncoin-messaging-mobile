import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { conversationKeys } from '@/features/conversations';
import { conversations } from '@/test/fixtures';
import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const textOf = (element: Parameters<typeof within>[0]) =>
  within(element)
    .getAllByText(/.+/)
    .map((text) => text.props.children)
    .join(' ');

const findUserOptions = async () => (await screen.findAllByRole('button')).map(textOf);

const goBackToList = async () => {
  await fireEvent.press(await screen.findByRole('link', { name: 'Back to conversations' }));
  await screen.findByRole('header', { name: 'Conversations' });
};

describe('NewConversation', () => {
  it('is reachable from the conversation list', async () => {
    await renderRoute('/');

    await fireEvent.press(await screen.findByRole('link', { name: 'New conversation' }));

    expect(await screen.findByRole('header', { name: 'New conversation' })).toBeOnTheScreen();
  });

  it('lists the other users alphabetically and flags existing conversations', async () => {
    await renderRoute('/conversations/new');

    expect(await findUserOptions()).toEqual(['Elodie Open conversation', 'Jeremie Open conversation', 'Patrick']);
  });

  it('filters users by nickname', async () => {
    await renderRoute('/conversations/new');
    const search = await screen.findByLabelText('Search users');

    await fireEvent.changeText(search, 'pat');

    expect(await findUserOptions()).toEqual(['Patrick']);

    await fireEvent.changeText(search, 'zzz');

    expect(await screen.findByText('No user matches “zzz”.')).toBeOnTheScreen();
  });

  it('opens the existing conversation instead of creating a duplicate', async () => {
    let created = false;
    server.use(
      http.post(apiUrl('/conversations/:userId'), () => {
        created = true;
        return HttpResponse.json({ id: 99 });
      }),
    );
    const { getPathname } = await renderRoute('/conversations/new');

    await fireEvent.press(await screen.findByRole('button', { name: /Jeremie/ }));

    expect(await screen.findByLabelText('Messages with Jeremie')).toBeOnTheScreen();
    await waitFor(() => expect(getPathname()).toBe('/conversations/1'));
    expect(created).toBe(false);
  });

  it('creates a conversation, opens it and adds it to the list', async () => {
    let body: unknown;
    server.use(
      http.post(apiUrl('/conversations/1'), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 4 });
      }),
    );
    const { getPathname } = await renderRoute('/conversations/new');

    await fireEvent.press(await screen.findByRole('button', { name: /Patrick/ }));

    expect(await screen.findByRole('header', { name: 'Patrick' })).toBeOnTheScreen();
    await waitFor(() => expect(getPathname()).toBe('/conversations/4'));
    expect(body).toMatchObject({ senderId: 1, senderNickname: 'Thibaut', recipientId: 3, recipientNickname: 'Patrick' });

    await goBackToList();

    expect(await screen.findByRole('link', { name: /Patrick/ })).toBeOnTheScreen();
  });

  it('keeps the new conversation when the server does not return it yet', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json(conversations)));
    const { queryClient } = await renderRoute('/conversations/new');

    await fireEvent.press(await screen.findByRole('button', { name: /Patrick/ }));
    await screen.findByRole('header', { name: 'Patrick' });

    await queryClient.refetchQueries({ queryKey: conversationKeys.all });

    expect(screen.getByRole('header', { name: 'Patrick' })).toBeOnTheScreen();
    await goBackToList();
    expect(await screen.findByRole('link', { name: /Patrick/ })).toBeOnTheScreen();
  });

  it('keeps the new conversation after the app restarts', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json(conversations)));
    const first = await renderRoute('/conversations/new');

    await fireEvent.press(await screen.findByRole('button', { name: /Patrick/ }));
    await screen.findByRole('header', { name: 'Patrick' });
    await first.unmount();

    await renderRoute('/');

    expect(await screen.findByRole('link', { name: /Patrick/ })).toBeOnTheScreen();
  });

  it('shows an error and stays on the screen when the creation fails', async () => {
    server.use(http.post(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 })));
    const { getPathname } = await renderRoute('/conversations/new');

    await fireEvent.press(await screen.findByRole('button', { name: /Patrick/ }));

    expect(await screen.findByText(/Could not start the conversation\./)).toBeOnTheScreen();
    expect(getPathname()).toBe('/conversations/new');
  });

  it('shows an error with a retry button when users cannot be loaded', async () => {
    server.use(http.get(apiUrl('/users'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/conversations/new');

    expect(await screen.findByText('Users unavailable')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('button', { name: /Patrick/ })).toBeOnTheScreen();
  });

  it('invites users without conversations to start one', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json([])));
    await renderRoute('/');

    await fireEvent.press(await screen.findByText('Start a conversation'));

    expect(await screen.findByRole('header', { name: 'New conversation' })).toBeOnTheScreen();
  });
});
