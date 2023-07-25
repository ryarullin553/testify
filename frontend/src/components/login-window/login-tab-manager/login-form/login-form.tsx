import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { LoginFormInput } from './login-form-input/login-form-input';
import styles from './login-form.module.scss';
import React from 'react';
import { FORM_TABS, LoginFormState } from '../../login-window';

interface Props {
  formTab: FORM_TABS,
  handleFormSubmit: (evt: FormEvent<HTMLButtonElement>, formTab: FORM_TABS, formState: LoginFormState) => void,
}

export const LoginForm: FC<Props> = ({ formTab, handleFormSubmit }) => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
  });

  const INPUT_LIST = [
    {type: 'email', id: 'email', placeholder: 'E-mail', value: formState.email},
    {type: 'text', id: 'username', placeholder: 'Имя и фамилия', value: formState.username},
    {type: 'password', id: 'password', placeholder: 'Пароль', value: formState.password},
    {type: 'password', id: 'passwordRepeat', placeholder: 'Подтвердите пароль', value: formState.passwordRepeat},
  ];

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const {value, name} = evt.target;
    setFormState({...formState, [name]: value});
  }

  const submitButtonValue = () => {
    switch (formTab) {
      case FORM_TABS.SIGN_IN:
        return 'Войти';
      case FORM_TABS.SIGN_UP:
        return 'Зарегистрироваться';
      case FORM_TABS.RESET:
        return 'Сбросить пароль';
      default:
        return '';
    }
  };

  return (
  <form className={styles.signForm} action="#">
    {INPUT_LIST.map(props => <LoginFormInput
      formTab={formTab}
      handleFieldChange={handleFieldChange}
      {...props}
    />)}
    <button onSubmit={(evt) => handleFormSubmit(evt, formTab, formState)}>{submitButtonValue()}</button>
  </form>
  );
}
