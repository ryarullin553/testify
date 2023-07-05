import React, { FC } from 'react';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { ProfileSettings } from '../components/profile-settings/profile-settings';

export const ProfileSettingPage: FC = () => {
  return (
    <>
      <Header />
      <ProfileSettings/>
      <Footer />
    </>
  );
}