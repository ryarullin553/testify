import ReactModal from 'react-modal';
import styles from './login-window.module.scss';
import { LoginTabManager } from './login-tab-manager/login-tab-manager';
import React, { FC } from 'react';

interface Props {
  isOpen: boolean,
  handleCloseModal: () => void,
}

export enum FORM_TABS {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  RESET = 'reset',
}

export interface LoginFormState {
  email: string,
  username: string,
  password: string,
  passwordRepeat: string,
}

export const LoginWindow: FC<Props> = ({ isOpen, handleCloseModal }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className={styles.loginWindow}
      overlayClassName={styles.overlay}
      onRequestClose={handleCloseModal}
    >
      <LoginTabManager handleCloseModal={handleCloseModal}/>
    </ReactModal>
  )
};
