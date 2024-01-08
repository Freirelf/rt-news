import { render, screen, fireEvent } from '@testing-library/react'
import { SessionProvider, useSession } from 'next-auth/react'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import SubscribeButton from '.'

// Mockando useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(),
  signIn: jest.fn(),
}))

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    // Mock para useSession
    mocked(useSession).mockReturnValue([null, false] as any)

    render(
      // Envolve o componente SubscribeButton dentro do SessionProvider
      <SessionProvider session={null}>
        <SubscribeButton />
      </SessionProvider>
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authentication', () => {
    const signInMocked = mocked(signIn)

    render(<SubscribeButton />) 

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects user to posts when already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: 'John Doe', email: 'john.doe@example.com'},
        expires: 'fake-expires',
        activeSubscription: 'active'
      },
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalled();
  })
});
