  import { act, render, screen } from '@testing-library/react';
  import { mocked } from 'ts-jest/utils';
  import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
  import { getPrismicClient } from '../../services/prismic';
  import { useSession } from 'next-auth/react';
  import { useRouter } from 'next/router';

  const post = {
      slug: 'my-new-post',
      title: 'My New Post',
      content: '<p>Post excerpt</p>',
      updatedAt: '10Abril'
    };

  jest.mock('next-auth/react');
  jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'), // Garante que as funcionalidades reais sejam mantidas
    useRouter: jest.fn(), // Mocka a função useRouter
  }));
  jest.mock('../../services/prismic');

  describe('Post preview page', () => {
    it('renders correctly', () => {
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([null, false] as any);


      render(<PostPreview post={post} />)

      expect(screen.getByText("My New Post")).toBeInTheDocument();
      expect(screen.getByText("Post excerpt")).toBeInTheDocument();
      expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    })

    it('redirect user to full post when user is subscribed', async () => {
      const useSessionMocked = mocked(useSession);
      const useRouterMocked = mocked(useRouter);
      const pushMock = jest.fn();

      useSessionMocked.mockReturnValueOnce([{ activeSubscription: true }, false] as any);


      useRouterMocked.mockReturnValueOnce({
        push: pushMock,
      } as any);

      render(<PostPreview post={post} />)

      await act(async () => {
        setTimeout(() => {
          expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
        }, 1000); // Ajuste o tempo conforme necessário
      });
    });

    it('loads initial data', async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);

      getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [
              { type: 'heading', text: 'My new post' }
            ],
            content: [
              { type: 'paragraph', text: 'Post content' }
            ],
          },
          last_publication_date: '04-01-2021'
        })
      } as any)

      const response = await getStaticProps({ params: { slug: 'my-new-post' }});

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            post: {
              slug: 'my-new-post',
              title: 'My new post',
              content: '<p>Post content</p>',
              updatedAt: '01 de abril de 2021'
            }
          }        
        })
      );

    })
  })