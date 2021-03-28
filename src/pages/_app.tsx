import {
  AppProps,
  // AppContext,
} from 'next/app'
import Head from 'next/head'

import '../styles/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
