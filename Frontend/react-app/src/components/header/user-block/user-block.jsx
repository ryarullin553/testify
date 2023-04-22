import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthorizationStatus, selectUserInfo } from '../../../store/selectors';
import styles from './user-block.module.scss';
import { LoginWindow } from '../../login-window/login-window';
import { DropdownMenu } from '../../dropdown-menu/dropdown-menu';
import { PaleButton } from '../../pale-button/pale-button';

export const UserBlock = () => {
  let {avatar} = useSelector(selectUserInfo);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthorized = useSelector(selectAuthorizationStatus);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleMenuClick = (evt) => {
    setIsMenuOpen(true);
  }

  const actionCloseMenu = () => {
    setIsMenuOpen(false);
  }

  if (!isAuthorized) {
    return (
      <>
        <PaleButton label={'Войти'} action={handleOpenModal} />
        <LoginWindow
          isOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
        />
      </>
    );
  }

  return (
    <div className={styles.userBlock}>
      <button onClick={handleMenuClick}>
        <img src={avatar} />
      </button>
      {isMenuOpen && <DropdownMenu actionCloseMenu={actionCloseMenu} />}
    </div>
  );
}
