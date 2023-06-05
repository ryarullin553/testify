import { useState } from 'react';
import { FORM_TABS } from '../login-tab-manager';
import { LoginFormInput } from './login-form-input/login-form-input';
import styles from './login-form.module.scss';

export const LoginForm = ({formTab, handleFormSubmit}) => {
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
  });

  const INPUT_LIST = [
    {type: 'email', id: 'email', placeholder: 'E-mail', value: formState.email},
    {type: 'text', id: 'username', placeholder: 'Имя и фамилия', value: formState.id},
    {type: 'password', id: 'password', placeholder: 'Пароль', value: formState.password},
    {type: 'password', id: 'passwordRepeat', placeholder: 'Подтвердите пароль', value: formState.passwordRepeat},
  ];

  const handleFieldChange = (evt) => {
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
    <button onClick={(evt) => handleFormSubmit(evt, formTab, formState)}>{submitButtonValue()}</button>
  </form>
  );
}
