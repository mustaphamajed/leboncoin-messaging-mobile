import { onlineManager } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { server } from '@/test/msw/server';
import { apiUrl } from '@/test/msw/utils';
import { renderRoute } from '@/test/renderRoute';

const findBanner = () => screen.findByLabelText('Connection status');

describe('ConnectionBanner', () => {
  it('stays empty when everything works', async () => {
    await renderRoute('/');

    await screen.findAllByRole('link', { name: /Jeremie|Elodie/ });

    expect(await findBanner()).toBeEmptyElement();
  });

  it('warns the user when they go offline and hides once back online', async () => {
    await renderRoute('/');
    const banner = await findBanner();

    await act(() => onlineManager.setOnline(false));
    expect(within(banner).getByText(/You are offline/)).toBeOnTheScreen();

    await act(() => onlineManager.setOnline(true));
    expect(banner).toBeEmptyElement();
  });

  it('reassures the user while the servers are failing and hides once they recover', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }));
    await renderRoute('/');
    const banner = await findBanner();

    expect(await within(banner).findByText(/servers are having a hiccup/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => expect(banner).toBeEmptyElement());
  });

  it('does not blame the servers for client errors', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 400 })));
    await renderRoute('/');

    await screen.findByText('Conversations unavailable');

    expect(await findBanner()).toBeEmptyElement();
  });
});
