import Head from "next/head";
import { GetStaticProps } from "next";
import Link from 'next/link'
import { getPrismicClient } from "../../services/prismic";
import Prismic from '@prismicio/client'
import { RichText } from "prismic-dom"
import styles from './styles.module.scss'

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps){
  return (
    <>
      <Head>
        <title>Posts | rtnews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>

          { posts.map(post => (
            <Link key={post.slug} legacyBehavior href={`/posts/${post.slug}`}>
              <a> 
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}

        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'], 
    pageSize: 100, 
  });

  

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content: { type: string }) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-BR', {
        day: "2-digit",
        month: 'long',
        year: 'numeric',
      })
    }
  })

  return {
    props: {
      posts
    }
  };
};