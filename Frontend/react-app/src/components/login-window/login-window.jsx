import ReactModal from 'react-modal';
import styles from './login-window.module.scss';
import { LoginTabManager } from './login-tab-manager/login-tab-manager';

export const LoginWindow = ({isOpen, handleCloseModal}) => {
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
