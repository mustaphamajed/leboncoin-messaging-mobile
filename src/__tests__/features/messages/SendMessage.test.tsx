import { onlineManager } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { MESSAGE_MAX_LENGTH } from '@/services';
import { db } from '@/test/msw/db';
import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const findComposer = (name = 'Jeremie') => screen.findByLabelText(`Message to ${name}`);
const getSendButton = () => screen.getByRole('button', { name: 'Send message' });

async function send(text: string, name?: string) {
  await fireEvent.changeText(await findComposer(name), text);
  await fireEvent.press(getSendButton());
}

function deferredResponse() {
  let resolve!: () => void;
  const released = new Promise<void>((r) => (resolve = r));
  return { released, release: () => resolve() };
}

describe('sending a message', () => {
  it('sends the trimmed message, shows it in the conversation and clears the input', async () => {
    let body: unknown;
    server.use(
      http.post(apiUrl('/messages/1'), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 50 });
      }),
    );
    await renderRoute('/conversations/1');

    await send('  Is it still available?  ');

    expect(await screen.findByText('Is it still available?')).toBeOnTheScreen();
    expect(await findComposer()).toHaveDisplayValue('');
    await waitFor(() => expect(body).toMatchObject({ conversationId: 1, authorId: 1, body: 'Is it still available?' }));
  });

  it('does not allow sending an empty message', async () => {
    await renderRoute('/conversations/1');
    await findComposer();

    expect(getSendButton()).toBeDisabled();

    await fireEvent.changeText(await findComposer(), '   ');

    expect(getSendButton()).toBeDisabled();
  });

  it('shows the message as sending until the server confirms it', async () => {
    const { released, release } = deferredResponse();
    server.use(
      http.post(apiUrl('/messages/1'), async () => {
        await released;
        return HttpResponse.json({ id: 51 });
      }),
    );
    await renderRoute('/conversations/1');

    await send('On my way');

    expect(await screen.findByText('On my way')).toBeOnTheScreen();
    expect(screen.getByText('Sending…')).toBeOnTheScreen();

    release();

    await waitFor(() => expect(screen.queryByText('Sending…')).toBeNull());
    expect(screen.getByText('On my way')).toBeOnTheScreen();
  });

  it('keeps a failed message with the option to retry it', async () => {
    server.use(http.post(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/conversations/1');

    await send('Are you there?');

    expect(await screen.findByText('Not sent.')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(screen.queryByText('Not sent.')).toBeNull());
    expect(screen.getByText('Are you there?')).toBeOnTheScreen();
  });

  it('lets the user delete a failed message', async () => {
    server.use(http.post(apiUrl('/messages/1'), () => HttpResponse.error()));
    await renderRoute('/conversations/1');

    await send('Oops');

    await fireEvent.press(await screen.findByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(screen.queryByText('Oops')).toBeNull());
  });

  it('waits for the connection to come back before sending a message written offline', async () => {
    const isSaved = () => db.messages.some(({ body }) => body === 'See you tomorrow');
    await renderRoute('/conversations/1');
    await findComposer();

    await act(() => onlineManager.setOnline(false));
    await send('See you tomorrow');

    expect(await screen.findByText('Waiting for connection…')).toBeOnTheScreen();
    expect(isSaved()).toBe(false);

    await act(() => onlineManager.setOnline(true));

    await waitFor(() => expect(screen.queryByText('Waiting for connection…')).toBeNull());
    expect(isSaved()).toBe(true);
    expect(screen.getByText('See you tomorrow')).toBeOnTheScreen();
  });

  it('replaces the empty state when sending the first message', async () => {
    await renderRoute('/conversations/3');

    await send('Hi Elodie', 'Elodie');

    expect(await screen.findByText('Hi Elodie')).toBeOnTheScreen();
    expect(screen.queryByRole('header', { name: 'No messages yet' })).toBeNull();
  });

  it('limits the message length and warns when getting close to it', async () => {
    await renderRoute('/conversations/1');
    const composer = await findComposer();

    expect(composer.props.maxLength).toBe(MESSAGE_MAX_LENGTH);

    await fireEvent.changeText(composer, 'a'.repeat(MESSAGE_MAX_LENGTH - 50));

    expect(screen.getByText('50 characters left')).toBeOnTheScreen();
  });
});
