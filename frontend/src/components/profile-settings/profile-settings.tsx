'use client'

import styles from './profile-settings.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { ResetPasswordComponent } from "../reset-passord-content/reset-password-component/reset-password-component";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { api, store } from '../../store';
import { checkAuthAction } from '../../store/api-actions';
import { useParams } from 'next/navigation';

interface FormData {
  userName: string,
  userBio: string,
  userAvatar: File | null,
}

export const ProfileSettings: FC = () => {
  let {userID} = useParams();

  userID ||= 'me';

  const [formData, setFormData] = useState<FormData>({
    userName: '',
    userBio: '',
    userAvatar: null,
  });

  const handleOnFormChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleAvatarUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.target;
    if (files) setFormData({ ...formData, userAvatar: files[0] });
  }

  const handleSubmit = async (evt: FormEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    let config;
    if (formData.userAvatar) {
      config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
    }
    await api.patch(`/users/${userID}/`, formData, config);
    store.dispatch(checkAuthAction());
  }

  const fetchUserData = async () => {
      const { data } = await api.get(`/users/${userID}/`);
      const userData: FormData = {
        userName: data.username,
        userBio: data.userBio,
        userAvatar: null,
      }
      setFormData(userData);
  }

  useEffect(() => {
      fetchUserData();
  }, []);

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <form className={styles.contentForm} action="#" name="create-test-form">
        <h1 className={styles.createTest}>Редактирование профиля</h1>
        <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
          <label>Имя и фамилия</label>
          <textarea
            id='username'
            name='username'
            value={formData.userName}
            onChange={handleOnFormChange}
          />
        </fieldset>
        <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
          <label>О себе</label>
          <textarea
            id='bio'
            name='bio'
            value={formData.userBio}
            onChange={handleOnFormChange}
          />
        </fieldset>
        <fieldset className={styles.testLogo}>
          <label>Аватар</label>
          <div
            className={`${styles.dropZone} ${formData.userAvatar && styles.active}`}
          >
            <p>png-файл с прозрачностью 230х230px</p>
            <input
              type='file'
              id='avatar'
              name='avatar'
              accept="image/png"
              onChange={handleAvatarUpload}
            />
          </div>
        </fieldset>
        <div className={styles.controls}>
          <button className={styles.createButton} onSubmit={handleSubmit}>Сохранить</button>
        </div>
      </form >
      {/* <ResetPasswordComponent /> */}
    </main>
  );
}
