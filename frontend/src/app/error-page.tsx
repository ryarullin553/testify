import React, { FC } from 'react'
import { ErrorPageContent } from '../components/error-page-content/error-page-content'
import { Footer } from '../components/footer/footer'
import { Header } from '../components/header/header'

interface Props {
  errorCode: number
}

export const ErrorPage: FC<Props> = ({ errorCode }) => {
  return (
    <>
      <Header />
      <ErrorPageContent />
      <Footer />
    </>
  )
}
