import React from 'react'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import '../styles/global.scss'
import Header from '../components/Header'
 
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    
    </SessionProvider>

  )
}