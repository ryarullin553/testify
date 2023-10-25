import { Main } from '@/components/Main/Main'
import { Footer } from '@/components/footer/footer'
import { TestContent } from '@/components/test-content/test-content'
import { FC } from 'react'

const TestPage: FC = () => {
  return (
    <>
      <Main>
        <TestContent />
      </Main>
      <Footer />
    </>
  )
}

export default TestPage
