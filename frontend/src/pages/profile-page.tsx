import { Footer } from '../components/footer/footer';
import { ProfilePageComponent } from '../components/profile-page/profile-page-component';
import { Header } from '../components/header/header';
import React, { FC } from 'react';

export const ProfilePage: FC = () => {

  return (
    <>
      <Header />
      <ProfilePageComponent />
      <Footer />
    </>
  );
}