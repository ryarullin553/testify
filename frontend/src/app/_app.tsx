import '@/global.css'
import { ErrorMessage } from '@/components/error-message/error-message'
import { store } from '@/store'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { checkAuthAction } from '@/store/api-actions'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(checkAuthAction())
  }, [])

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ErrorMessage />
        <Head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </React.StrictMode>
  )
}
