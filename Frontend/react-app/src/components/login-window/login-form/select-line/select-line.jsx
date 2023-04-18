import styles from './select-line.module.css';
import { FORM_TABS } from '../login-form';

export const SelectLine = ({formState}) => {
    const selectLinePosition = () => {
    switch (formState) {
      case FORM_TABS.SIGN_IN:
        return '-100px';
      case FORM_TABS.SIGN_UP:
        return '-3px';
      case FORM_TABS.RESET:
        return '-200px';
      default:
        return '-200px';
    }
  }
  return (
    <div className={styles.selectLine} style={{backgroundPosition: selectLinePosition()}}/>
  )
};
