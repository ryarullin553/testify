import { useState } from 'react';
import { LoginFormInput } from './login-form-input/login-form-input';
import styles from './login-form.module.scss';
import { SelectLine } from './select-line/select-line';

export const FORM_STATES = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  RESET: 'reset',
};

export const LoginForm = () => {
  let [formState, setFormState] = useState(FORM_STATES.SIGN_IN);

  const submitButtonValue = () => {
    switch (formState) {
      case FORM_STATES.SIGN_IN:
        return 'Войти';
      case FORM_STATES.SIGN_UP:
        return 'Зарегистрироваться';
      case FORM_STATES.RESET:
        return 'Сбросить пароль';
      default:
        return '';
    }
  };

  const INPUT_LIST = [
    {formState: formState, type: 'email', id: 'email', placeholder: 'E-mail'},
    {formState: formState, type: 'text', id: 'name', placeholder: 'Имя и фамилия'},
    {formState: formState, type: 'password', id: 'password', placeholder: 'Пароль'},
    {formState: formState, type: 'password', id: 'password-repeat', placeholder: 'Подтвердите пароль'},
  ];

  return (
    <div className={styles.container}>
      <header className={styles.tabs}>
        <button
          className={(formState === FORM_STATES.SIGN_IN) && styles.active}
          onClick={() => setFormState(FORM_STATES.SIGN_IN)}
        >Вход</button>
        <button
          className={(formState === FORM_STATES.SIGN_UP) && styles.active}
          onClick={() => setFormState(FORM_STATES.SIGN_UP)}
        >Регистрация</button>
        <SelectLine formState={formState}/>
      </header>
      <form className={styles.signForm} action="#">
        {INPUT_LIST.map(props => <LoginFormInput {...props}/>)}
        <button>{submitButtonValue()}</button>
      </form>
      {
        (formState === FORM_STATES.SIGN_IN)
        &&
        <button
          className={styles.resetButton}
          onClick={() => setFormState(FORM_STATES.RESET)}
        >Забыли пароль?</button>
      }
    </div>
  )
};
