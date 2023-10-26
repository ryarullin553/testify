import { Main } from '@/components/Main/Main'
import { Footer } from '@/components/footer/footer'
import { ProfileSettings } from '@/components/profile-settings/profile-settings'
import React, { FC } from 'react'

const ProfileSettingPage: FC = () => {
  return (
    <>
      <Main>
        <ProfileSettings />
      </Main>
      <Footer />
    </>
  )
}

export default ProfileSettingPage
