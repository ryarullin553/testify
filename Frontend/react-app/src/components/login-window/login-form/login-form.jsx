import { useState } from 'react';
import styles from './login-form.module.scss';

export const LoginForm = () => {
  const FORM_STATES = {
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up',
    RESET: 'reset',
  };

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
  }

  const selectLinePosition = () => {
    switch (formState) {
      case FORM_STATES.SIGN_IN:
        return '-100px';
      case FORM_STATES.SIGN_UP:
        return '-3px';
      case FORM_STATES.RESET:
        return '-200px';
      default:
        return '-200px';
    }
  }

  const setSignInState = () => {
    setFormState(FORM_STATES.SIGN_IN);
  }

  const setSignUpState = () => {
    setFormState(FORM_STATES.SIGN_UP);
  }
  
  const setResetState = () => {
    setFormState(FORM_STATES.RESET);
  }

  return (
    <div className={styles.container}>
      <footer className={styles.tabs}>
        <button
          className={(formState === FORM_STATES.SIGN_IN) && styles.active}
          onClick={setSignInState}
        >Вход</button>
        <button
          className={(formState === FORM_STATES.SIGN_UP) && styles.active}
          onClick={setSignUpState}
        >Регистрация</button>
        <div className={styles.selectLine} style={{backgroundPosition: selectLinePosition()}}></div>
      </footer>
      <form className={styles.signForm} action="#">
        <input
          type='email'
          name='sign-form'
          id='email'
          placeholder='E-mail'
          defaultValue=''
        />
        {
          (formState === FORM_STATES.SIGN_UP)
          &&
          <input
            type='text'
            name='sign-form'
            id='name'
            placeholder='Имя и фамилия'
            defaultValue=''
          />
        }
        {
          ((formState === FORM_STATES.SIGN_UP)
          || (formState === FORM_STATES.SIGN_IN))
          &&
          <input
          type='password'
          name='sign-form'
          id='password'
          placeholder='Пароль'
          defaultValue=''
          />
        }
        {
          (formState === FORM_STATES.SIGN_UP)
          &&
          <input
          type='password'
          name='sign-form'
          id='password-repeat'
          placeholder='Подтвердите пароль'
          defaultValue=''
        />
        }
        <button>{submitButtonValue()}</button>
      </form>
      {
        (formState === FORM_STATES.SIGN_IN)
        &&
        <button
          className={styles.resetButton}
          onClick={setResetState}
        >Забыли пароль?</button>
      }
    </div>
  )
};
