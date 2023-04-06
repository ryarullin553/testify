import styles from './select-line.module.css';
import { FORM_STATES } from '../login-form';

export const SelectLine = ({formState}) => {
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
  return (
    <div className={styles.selectLine} style={{backgroundPosition: selectLinePosition()}}/>
  )
};
