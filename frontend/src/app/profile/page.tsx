import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { ProfilePageComponent } from '@/components/profile-page/profile-page-component';
import { FC } from 'react';

const ProfilePage: FC = () => {
  return (
    <>
      <Header />
      <ProfilePageComponent />
      <Footer />
    </>
  )
}

export default ProfilePage
