import { ProfileTestsComponent } from '../components/profile-tests/profile-tests';
import { Header } from '../components/header/header';
import React, { FC } from 'react';

export const ProfileTestsPage: FC = () => {
  return (
    <>
      <Header/>
      <ProfileTestsComponent />
    </>
  );
}
