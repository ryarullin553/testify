import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { LoginFormInput } from './login-form-input/login-form-input'
import styles from './login-form.module.scss'
import { FORM_TABS, LoginFormState } from '../../login-window'
import { Button } from '@/components/Button/Button'

export interface InputProps {
  type: string
  id: string
  placeholder: string
  value: string
}

interface Props {
  formTab: FORM_TABS
  handleFormSubmit: (evt: FormEvent<HTMLFormElement>, formTab: FORM_TABS, formState: LoginFormState) => void
}

export const LoginForm: FC<Props> = ({ formTab, handleFormSubmit }) => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: 'test@test.ru',
    username: '',
    password: 'test',
    passwordRepeat: '',
  })

  const INPUT_LIST: InputProps[] = [
    { type: 'email', id: 'email', placeholder: 'E-mail', value: formState.email },
    { type: 'text', id: 'username', placeholder: 'Имя и фамилия', value: formState.username },
    { type: 'password', id: 'password', placeholder: 'Пароль', value: formState.password },
    { type: 'password', id: 'passwordRepeat', placeholder: 'Подтвердите пароль', value: formState.passwordRepeat },
  ]

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target
    setFormState({ ...formState, [name]: value })
  }

  const submitButtonValue = () => {
    switch (formTab) {
      case FORM_TABS.SIGN_IN:
        return 'Войти'
      case FORM_TABS.SIGN_UP:
        return 'Зарегистрироваться'
      case FORM_TABS.RESET:
        return 'Сбросить пароль'
      default:
        return ''
    }
  }

  return (
    <form className={styles.signForm} action='#' onSubmit={(evt) => handleFormSubmit(evt, formTab, formState)}>
      {INPUT_LIST.map((props) => (
        <LoginFormInput formTab={formTab} handleFieldChange={handleFieldChange} inputProps={props} />
      ))}
      <Button type={'submit'} widthMax outerStyles={styles.submitButton}>
        {submitButtonValue()}
      </Button>
    </form>
  )
}
