import { useState } from 'react';
import styles from './login-tab-manager.module.scss';
import { LoginTabs } from './login-tabs/login-tabs.jsx';
import { LoginForm } from './login-form/login-form.jsx';
import { api, store } from '../../../store';
import { loginAction, checkAuthAction } from '../../../store/api-actions';

export const FORM_TABS = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  RESET: 'reset',
};

export const LoginTabManager = ({handleCloseModal}) => {
  const [formTab, setFormTab] = useState(FORM_TABS.SIGN_IN);

  const handleFormSubmit = async (evt, formTab, formState) => {
    const {username, email, password} = formState;
    evt.preventDefault();
    switch (formTab) {
      case FORM_TABS.SIGN_IN:
        actionLogin(email, password);
        break;
      case FORM_TABS.SIGN_UP:
        actionRegister(username, email, password);
        break;
      case FORM_TABS.RESET:
        actionResetPassword(email);
        break;
    }
    handleCloseModal();
  }

  const actionLogin = async (email, password) => {
    await store.dispatch(loginAction({email, password}));
    await store.dispatch(checkAuthAction());
  }

  const actionRegister = async (username, email, password) => {
    await api.post('api/auth/users/', {username, email, password});
  }

  const actionResetPassword = async (email) => {
    await api.post('api/auth/users/reset_password/', {email});
  }

  return (
    <div className={styles.container}>
      <LoginTabs formTab={formTab} setFormTab={setFormTab} >
        <LoginForm formTab={formTab} handleFormSubmit={handleFormSubmit}/>
      </LoginTabs>
    </div>
  )
};
