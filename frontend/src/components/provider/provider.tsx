'use client'

import { FC, PropsWithChildren, useEffect } from 'react'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { checkAuthAction } from '@/store/api-actions'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    store.dispatch(checkAuthAction())
  }, [])

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
