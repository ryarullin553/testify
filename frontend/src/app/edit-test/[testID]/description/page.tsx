import { Main } from '@/components/Main/Main'
import { EditTestDescriptionContent } from '@/components/edit-test-description-content/edit-test-description-content'
import { Footer } from '@/components/footer/footer'
import { FC } from 'react'

const EditTestDescriptionPage: FC = () => {
  return (
    <>
      <Main>
        <EditTestDescriptionContent />
      </Main>
      <Footer />
    </>
  )
}

export default EditTestDescriptionPage
