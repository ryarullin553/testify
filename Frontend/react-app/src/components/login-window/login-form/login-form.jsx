import { api, store } from '../../../store/index.js';
import { useState } from 'react';
import { LoginFormInput } from './login-form-input/login-form-input';
import styles from './login-form.module.scss';
import { SelectLine } from './select-line/select-line';
import { checkAuthAction, loginAction } from '../../../store/api-actions.js';

export const FORM_TABS = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  RESET: 'reset',
};

export const LoginForm = ({handleCloseModal}) => {
  let [formTab, setFormTab] = useState(FORM_TABS.SIGN_IN);
  let [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
  });

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

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();
    switch (formTab) {
      case FORM_TABS.SIGN_IN:
        actionLogin();
        break;
      case FORM_TABS.SIGN_UP:
        actionRegister();
        break;
      case FORM_TABS.RESET:
        break;
    }
    handleCloseModal();
  }

  const actionLogin = async () => {
    await store.dispatch(loginAction({email: formState.email, password: formState.password}));
    await store.dispatch(checkAuthAction());
  }

  const actionRegister = async () => {
    await api.post('api/auth/users/', {username: formState.username, email: formState.email, password: formState.password});
  }

  const INPUT_LIST = [
    {type: 'email', id: 'email', placeholder: 'E-mail', value: formState.email},
    {type: 'text', id: 'username', placeholder: 'Имя и фамилия', value: formState.id},
    {type: 'password', id: 'password', placeholder: 'Пароль', value: formState.password},
    {type: 'password', id: 'passwordRepeat', placeholder: 'Подтвердите пароль', value: formState.passwordRepeat},
  ];

  return (
    <div className={styles.container}>
      <header className={styles.tabs}>
        <button
          className={(formTab === FORM_TABS.SIGN_IN) && styles.active}
          onClick={() => setFormTab(FORM_TABS.SIGN_IN)}
        >Вход</button>
        <button
          className={(formTab === FORM_TABS.SIGN_UP) && styles.active}
          onClick={() => setFormTab(FORM_TABS.SIGN_UP)}
        >Регистрация</button>
        <SelectLine formTab={formTab}/>
      </header>
      <form className={styles.signForm} action="#">
        {INPUT_LIST.map(props => <LoginFormInput
          formTab={formTab}
          handleFieldChange={handleFieldChange}
          {...props}
        />)}
        <button onClick={handleFormSubmit}>{submitButtonValue()}</button>
      </form>
      {
        (formTab === FORM_TABS.SIGN_IN)
        &&
        <button
          className={styles.resetButton}
          onClick={() => setFormTab(FORM_TABS.RESET)}
        >Забыли пароль?</button>
      }
    </div>
  )
};
