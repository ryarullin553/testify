'use client'

import { useSelector } from 'react-redux';
import { selectErrorMessage } from '../../store/selectors';
import styles from './error-message.module.scss';
import { FC } from 'react';

export const ErrorMessage: FC = () => {
  const error = useSelector(selectErrorMessage);

  return (error)
    ? <div className={styles.errorMessage}>{error}</div>
    : null;
}
