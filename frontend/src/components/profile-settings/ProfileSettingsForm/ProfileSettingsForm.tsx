import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './ProfileSettingsForm.module.scss'
import { UserInfo } from '@/types/UserInfo'
import { useUpdateUserDataMutation } from '@/services/usersApi'

interface FormData {
  userName: string
  userBio: string
  // userAvatar: File | null
}

interface Props {
  initialUserInfo: UserInfo
}

export const ProfileSettingsForm: FC<Props> = ({ initialUserInfo }) => {
  const [updateUserData, _] = useUpdateUserDataMutation()
  const { userName, userBio, userEmail } = initialUserInfo
  const [formData, setFormData] = useState<FormData>({
    userName,
    userBio,
    // userAvatar: null
  })

  const handleOnFormChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = evt.target
    setFormData({ ...formData, [name]: value })
  }

  // const handleAvatarUpload = (evt: ChangeEvent<HTMLInputElement>) => {
  //   const { files } = evt.target
  //   if (files) setFormData({ ...formData, userAvatar: files[0] })
  // }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const { userName, userBio } = formData
    updateUserData({
      username: userName,
      email: userEmail,
      info: userBio,
    })
  }

  return (
    <form className={styles.contentForm} onSubmit={handleSubmit} action='#' name='create-test-form'>
      <h1 className={styles.createTest}>Редактирование профиля</h1>
      <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
        <label>Имя и фамилия</label>
        <textarea id='userName' name='userName' value={formData.userName} onChange={handleOnFormChange} />
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
        <label>О себе</label>
        <textarea id='userBio' name='userBio' value={formData.userBio} onChange={handleOnFormChange} />
      </fieldset>
      <fieldset className={styles.testLogo}>
        <label>Аватар</label>
        <div className={`${styles.dropZone} ${false && styles.active}`}>
          <p>png-файл с прозрачностью 230х230px</p>
          <input
            type='file'
            id='userAvatar'
            name='userAvatar'
            accept='image/png' /**onChange={handleAvatarUpload} **/
          />
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
