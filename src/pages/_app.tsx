import {
  AppProps,
  // AppContext,
} from 'next/app'
import Head from 'next/head'
import { SpeechContextProvider } from 'src/components/context/Speech'

import '../styles/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <SpeechContextProvider>
        <Component {...pageProps} />
      </SpeechContextProvider>
    </>
  )
}

export default MyApp
