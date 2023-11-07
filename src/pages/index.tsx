import Header from "../components/Header";
import SubscribeButton from "../components/SubscribeButton";
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import Head from "next/head";

interface HomeProps {
  product : {
    priceId: string;
    amount: number;
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
            Get access to all the publications. <br/>
            <span> 
              for {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(product.amount)} month.
            </span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="man coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const price = await stripe.prices.retrieve('price_1NznVNK646PjSc0PJaECO0H0', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount:price.unit_amount ? price.unit_amount / 100 : 0
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24horas
  };
}



