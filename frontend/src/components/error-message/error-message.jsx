import { useSelector } from 'react-redux';
import { selectErrorMessage } from '../../store/selectors';
import styles from './error-message.module.scss';

export const ErrorMessage = () => {
  const error = useSelector(selectErrorMessage);

  return (error)
    ? <div className={styles.errorMessage}>{error}</div>
    : null;
}
