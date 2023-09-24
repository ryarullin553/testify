import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './ProfileSettingsForm.module.scss'
import { UserInfo } from '@/types/UserInfo'
import { useUpdateUserDataMutation } from '@/services/usersApi'
import classNames from 'classnames'

interface FormData {
  userName: string
  userBio: string
  userAvatar: File | null
}

interface Props {
  initialUserInfo: UserInfo
}

export const ProfileSettingsForm: FC<Props> = ({ initialUserInfo }) => {
  const [updateUserData, _] = useUpdateUserDataMutation()
  const { userName, userBio } = initialUserInfo

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    updateUserData(formData)
  }

  return (
    <form className={styles.contentForm} onSubmit={handleSubmit} action='#' name='create-test-form'>
      <h1 className={styles.createTest}>Редактирование профиля</h1>
      <fieldset className={classNames(styles.contentArea, styles.titleForm)}>
        <label>Имя и фамилия</label>
        <textarea id='username' name='username' defaultValue={userName} />
      </fieldset>
      <fieldset className={classNames(styles.contentArea, styles.shortAbstractForm)}>
        <label>О себе</label>
        <textarea id='info' name='info' defaultValue={userBio} />
      </fieldset>
      <fieldset className={styles.testLogo}>
        <label>Аватар</label>
        <div className={classNames(styles.dropZone, false && styles.active)}>
          <p>png-файл с прозрачностью 230х230px</p>
          <input type='file' id='image' name='image' accept='image/png' />
        </div>
      </fieldset>
      <div className={styles.controls}>
        <button type={'submit'} className={styles.createButton}>
          Сохранить
        </button>
      </div>
    </form>
  )
}
