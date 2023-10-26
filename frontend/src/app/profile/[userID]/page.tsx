import { Main } from '@/components/Main/Main'
import { Footer } from '@/components/footer/footer'
import { ProfilePageComponent } from '@/components/profile-page/profile-page-component'
import { FC } from 'react'

const ProfilePage: FC = () => {
  return (
    <>
      <Main>
        <ProfilePageComponent />
      </Main>
      <Footer />
    </>
  )
}

export default ProfilePage
