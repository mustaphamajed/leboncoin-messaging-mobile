import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { messages } from '@/test/fixtures';
import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const findMessageList = () => screen.findByLabelText('Messages avec Jeremie');

describe('ConversationView', () => {
  it('shows the other participant and the date of the last message in the header', async () => {
    await renderRoute('/conversations/1');

    expect(await screen.findByRole('header', { name: 'Jeremie' })).toBeOnTheScreen();
    expect(screen.getByText('Dernier message : 7 juil. 2021')).toBeOnTheScreen();
  });

  it('shows the messages in chronological order with their author and the day', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => HttpResponse.json(messages.toReversed())));
    await renderRoute('/conversations/1');

    await findMessageList();
    const bubbles = screen.getAllByLabelText(/^(Vous|Jeremie) : /);

    // The list is inverted, so the latest message comes first in the rendered tree.
    expect(bubbles.map((bubble) => bubble.props.accessibilityLabel)).toEqual([
      'Jeremie : Salut !, 09:04',
      'Vous : Bonjour, 06:04',
    ]);
    expect(screen.getByText('Mercredi 7 juillet 2021')).toBeOnTheScreen();
  });

  it('shows an empty state when the conversation has no message', async () => {
    await renderRoute('/conversations/3');

    expect(await screen.findByRole('header', { name: 'Aucun message pour le moment' })).toBeOnTheScreen();
    expect(screen.getByText('Dites bonjour à Elodie !')).toBeOnTheScreen();
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

    expect(await screen.findByRole('header', { name: 'Conversation introuvable' })).toBeOnTheScreen();
    expect(messagesRequested).toBe(false);
  });

  it.each(['abc', '0', '-1', '1.5'])('shows a not found state for the invalid conversation id "%s"', async (id) => {
    await renderRoute(`/conversations/${id}`);

    expect(await screen.findByRole('header', { name: 'Conversation introuvable' })).toBeOnTheScreen();
  });

  it('links back to the conversations from the not found state', async () => {
    const { getPathname } = await renderRoute('/conversations/abc');

    await fireEvent.press(await screen.findByText('Retour aux conversations'));

    await waitFor(() => expect(getPathname()).toBe('/'));
  });

  it('shows an error with a retry button when messages fail to load', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/conversations/1');

    expect(await screen.findByText('Messages indisponibles')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer' }));

    expect(await findMessageList()).toBeOnTheScreen();
  });

  it('shows an error when the conversation cannot be loaded', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.error()));
    await renderRoute('/conversations/1');

    expect(await screen.findByText('Conversation indisponible')).toBeOnTheScreen();
  });

  it('offers a way back to the conversation list', async () => {
    const { getPathname } = await renderRoute('/conversations/1');

    await fireEvent.press(await screen.findByRole('link', { name: 'Retour aux conversations' }));

    await waitFor(() => expect(getPathname()).toBe('/'));
    expect(await screen.findByRole('header', { name: 'Conversations' })).toBeOnTheScreen();
  });
});
