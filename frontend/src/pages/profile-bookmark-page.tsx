import { ProfileBookmarkContent } from '../components/profile-bookmark-content/profile-bookmark-content'
import { Header } from '../components/header/header';
import React, { FC } from 'react';

export const ProfileBookmarkPage: FC = () => {

  return (
    <>
      <Header />
      <ProfileBookmarkContent  />
    </>
  );
}
