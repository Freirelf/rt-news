import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/react';

const post = {
  slug: 'my-new-post', title: 'My new post', content: '<p>Post content</p>', updatedAt: '14 de março'
}

jest.mock('../../services/prismic')

jest.mock('next-auth/react')

describe('Post page', () => {
  it('renders correctly', () => {

    render(<Post post={post} />)

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post'}
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMoked = mocked(getPrismicClient)
    getPrismicClientMoked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '2021-03-15'
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post'}
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '14 de março de 2021',
          },
        },
      })
    );
  })
})