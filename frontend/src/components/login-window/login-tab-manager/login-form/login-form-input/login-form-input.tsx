import { ChangeEvent } from 'react'
import { FORM_TABS, LoginFormState } from '../../../login-window'
import { InputProps } from '../login-form'
import styles from './login-form-input.module.scss'

interface Props {
  inputProps: InputProps
  formTab: FORM_TABS
  handleFieldChange: (evt: ChangeEvent<HTMLInputElement>) => void
}

export const LoginFormInput = ({ inputProps, formTab, handleFieldChange }: Props) => {
  const { id, type, placeholder, value } = inputProps
  const isRendered =
    id === 'email' || formTab === FORM_TABS.SIGN_UP || (formTab === FORM_TABS.SIGN_IN && id === 'password')

  return isRendered ? (
    <input
      className={styles.loginFormInput}
      type={type}
      name={id}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={handleFieldChange}
    />
  ) : (
    <></>
  )
}
