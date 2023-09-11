'use client'

import { FC, PropsWithChildren, useEffect } from 'react'
import { store } from '@/store/store'
import { Provider } from 'react-redux'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}
