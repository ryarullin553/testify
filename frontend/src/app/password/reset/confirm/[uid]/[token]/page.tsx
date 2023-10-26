import { Main } from '@/components/Main/Main'
import { Footer } from '@/components/footer/footer'
import { ResetPasswordContent } from '@/components/reset-passord-content/reset-passord-content'
import { FC } from 'react'

const ResetPasswordPage: FC = () => {
  return (
    <>
      <Main>
        <ResetPasswordContent />
      </Main>
      <Footer />
    </>
  )
}

export default ResetPasswordPage
