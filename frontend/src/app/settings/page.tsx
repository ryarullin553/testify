import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { ProfileSettings } from '@/components/profile-settings/profile-settings';
import React, { FC } from 'react';

const ProfileSettingPage: FC = () => {
  return (
    <>
      <Header />
      <ProfileSettings/>
      <Footer />
    </>
  )
}

export default ProfileSettingPage
