import Header from "../components/Header";
import SubscribeButton from "../components/SubscribeButton";
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import Head from "next/head";

interface HomeProps {
  product : {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>
          Home | rt.news
        </title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
          Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="man coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const price = await stripe.prices.retrieve('price_1IYfbnCiAeIiSh2vaCf4REf5')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount as any / 100),
  };


  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24horas
  };
}



