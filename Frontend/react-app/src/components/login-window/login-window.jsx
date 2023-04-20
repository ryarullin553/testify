import ReactModal from 'react-modal';
import { LoginForm } from './login-form/login-form';
import styles from './login-window.module.scss';

export const LoginWindow = ({isOpen, handleCloseModal}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className={styles.loginWindow}
      overlayClassName={styles.overlay}
      onRequestClose={handleCloseModal}
    >
      <LoginForm handleCloseModal={handleCloseModal}/>
    </ReactModal>
  )
};
