import { renderHook } from '@testing-library/react-native';

import { CurrentUserProvider, useCurrentUserId } from '@/context';

describe('useCurrentUserId', () => {
  it('returns the id provided by CurrentUserProvider', async () => {
    const { result } = await renderHook(useCurrentUserId, {
      wrapper: ({ children }) => <CurrentUserProvider userId={4}>{children}</CurrentUserProvider>,
    });

    expect(result.current).toBe(4);
  });

  it('throws when used outside CurrentUserProvider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderHook(useCurrentUserId)).rejects.toThrow(
      'useCurrentUserId must be used within a CurrentUserProvider',
    );
  });
});
