import { Header } from '@/components/header/header'
import { MyTestsPageContent } from '@/components/my-tests-page-content/my-tests-page-content'
import { FC } from 'react'

const MyTestsPage: FC = () => {
  return (
    <>
      <Header />
      <MyTestsPageContent />
    </>
  )
}

export default MyTestsPage
