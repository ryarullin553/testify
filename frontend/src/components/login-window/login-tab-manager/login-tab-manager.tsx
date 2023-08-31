import { FC, FormEvent, useState } from 'react';
import styles from './login-tab-manager.module.scss';
import { LoginTabs } from './login-tabs/login-tabs';
import { LoginForm } from './login-form/login-form';
import { api, store } from '../../../store';
import { loginAction, checkAuthAction } from '../../../store/api-actions';
import { FORM_TABS, LoginFormState } from '../login-window';

interface Props {
  handleCloseModal: () => void,
}

export const LoginTabManager: FC<Props> = ({ handleCloseModal }) => {
  const [formTab, setFormTab] = useState(FORM_TABS.SIGN_IN);

  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>, formTab: FORM_TABS, formState: LoginFormState) => {
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

  const actionLogin = async (email: string, password: string) => {
    await store.dispatch(loginAction({email, password}));
    await store.dispatch(checkAuthAction());
  }

  const actionRegister = async (username: string, email: string, password: string) => {
    await api.post('auth/users/', {username, email, password});
  }

  const actionResetPassword = async (email: string) => {
    await api.post('auth/users/reset_password/', {email});
  }

  return (
    <div className={styles.container}>
      <LoginTabs formTab={formTab} setFormTab={setFormTab} >
        <LoginForm formTab={formTab} handleFormSubmit={handleFormSubmit}/>
      </LoginTabs>
    </div>
  )
};
