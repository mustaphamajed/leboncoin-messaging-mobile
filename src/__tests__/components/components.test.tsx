import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Avatar, EmptyState, ErrorState, RouteErrorBoundary, Spinner } from '@/components';
import { ApiError } from '@/services';

describe('Avatar', () => {
  it('shows the uppercase initial, or ? for a blank name, hidden from screen readers', async () => {
    await render(
      <>
        <Avatar id={1} name=" thibaut" />
        <Avatar id={2} name="  " />
      </>,
    );

    expect(screen.queryByText('T')).toBeNull();
    expect(screen.getByText('T', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('?', { includeHiddenElements: true })).toBeOnTheScreen();
  });
});

describe('EmptyState', () => {
  it('renders the title, description and action', async () => {
    await render(<EmptyState title="No messages" description="Say hi" action={<Text>Start</Text>} />);

    expect(screen.getByRole('header', { name: 'No messages' })).toBeOnTheScreen();
    expect(screen.getByText('Say hi')).toBeOnTheScreen();
    expect(screen.getByText('Start')).toBeOnTheScreen();
  });
});

describe('ErrorState', () => {
  it('shows the error message and retries on press', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState title="Oops" error={new ApiError('x', { kind: 'network' })} onRetry={onRetry} />);

    expect(screen.getByText(/Impossible de joindre nos serveurs/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('disables the button while retrying', async () => {
    await render(<ErrorState title="Oops" error={new Error('x')} onRetry={jest.fn()} isRetrying />);

    expect(screen.getByRole('button', { name: 'Nouvelle tentative…' })).toBeDisabled();
  });
});

describe('Spinner', () => {
  it('is announced with its label', async () => {
    await render(<Spinner label="Loading messages" />);

    expect(screen.getByLabelText('Loading messages')).toBeOnTheScreen();
  });
});

describe('RouteErrorBoundary', () => {
  it('retries the route on press', async () => {
    const retry = jest.fn(async () => {});
    await render(<RouteErrorBoundary error={new Error('boom')} retry={retry} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
