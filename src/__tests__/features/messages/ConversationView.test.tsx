import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { messages } from '@/test/fixtures';
import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const findMessageList = () => screen.findByLabelText('Messages with Jeremie');

describe('ConversationView', () => {
  it('shows the other participant and the date of the last message in the header', async () => {
    await renderRoute('/conversations/1');

    expect(await screen.findByRole('header', { name: 'Jeremie' })).toBeOnTheScreen();
    expect(screen.getByText('Last message 7 juil. 2021')).toBeOnTheScreen();
  });

  it('shows the messages in chronological order with their author and the day', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => HttpResponse.json(messages.toReversed())));
    await renderRoute('/conversations/1');

    await findMessageList();
    const bubbles = screen.getAllByLabelText(/^(You|Jeremie): /);

    // The list is inverted, so the latest message comes first in the rendered tree.
    expect(bubbles.map((bubble) => bubble.props.accessibilityLabel)).toEqual([
      'Jeremie: Salut !, 09:04',
      'You: Bonjour, 06:04',
    ]);
    expect(screen.getByText('mercredi 7 juillet 2021')).toBeOnTheScreen();
  });

  it('shows an empty state when the conversation has no message', async () => {
    await renderRoute('/conversations/3');

    expect(await screen.findByRole('header', { name: 'No messages yet' })).toBeOnTheScreen();
    expect(screen.getByText('Say hello to Elodie!')).toBeOnTheScreen();
  });

  it('does not load messages of a conversation the user is not part of', async () => {
    let messagesRequested = false;
    server.use(
      http.get(apiUrl('/messages/:conversationId'), () => {
        messagesRequested = true;
        return HttpResponse.json([]);
      }),
    );
    await renderRoute('/conversations/1', { userId: 3 });

    expect(await screen.findByRole('header', { name: 'Conversation not found' })).toBeOnTheScreen();
    expect(messagesRequested).toBe(false);
  });

  it.each(['abc', '0', '-1', '1.5'])('shows a not found state for the invalid conversation id "%s"', async (id) => {
    await renderRoute(`/conversations/${id}`);

    expect(await screen.findByRole('header', { name: 'Conversation not found' })).toBeOnTheScreen();
  });

  it('links back to the conversations from the not found state', async () => {
    const { getPathname } = await renderRoute('/conversations/abc');

    await fireEvent.press(await screen.findByText('Back to conversations'));

    await waitFor(() => expect(getPathname()).toBe('/'));
  });

  it('shows an error with a retry button when messages fail to load', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/conversations/1');

    expect(await screen.findByText('Messages unavailable')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(await findMessageList()).toBeOnTheScreen();
  });

  it('shows an error when the conversation cannot be loaded', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.error()));
    await renderRoute('/conversations/1');

    expect(await screen.findByText('Conversation unavailable')).toBeOnTheScreen();
  });

  it('offers a way back to the conversation list', async () => {
    const { getPathname } = await renderRoute('/conversations/1');

    await fireEvent.press(await screen.findByRole('link', { name: 'Back to conversations' }));

    await waitFor(() => expect(getPathname()).toBe('/'));
    expect(await screen.findByRole('header', { name: 'Conversations' })).toBeOnTheScreen();
  });
});
