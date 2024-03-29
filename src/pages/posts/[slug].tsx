import { getPrismicClient } from "../../services/prismic";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";

import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | rtnews</title>
      </Head>

      <main className={styles.content}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
           className={styles.postContent}
           dangerouslySetInnerHTML={{__html: post.content}} 
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  if (!params) {
    return {
      notFound: true,
    };
  }

  const { slug } = params;

  if (session?.activeSubscription) {

  } else {
    return {
      redirect: {
        destination: '/', //`posts/preview/${slug}`,
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  const postTitle = response?.data?.title;

  const post = { 
    slug,
    title: postTitle ? RichText.asText(postTitle) : "Título não encontrado",
    content: RichText.asHtml(response?.data?.content),
    updatedAt: new Date(response?.last_publication_date as string).toLocaleDateString('pt-BR', {
      day: "2-digit",
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post,
    }
  }
}