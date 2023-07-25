import { FORM_TABS } from '../../../login-window';
import styles from './login-form-input.module.scss'

export const LoginFormInput = ({type, id, placeholder, formTab, value, handleFieldChange}) => {
  let isRendered = (
    (id === 'email')
    || (formTab === FORM_TABS.SIGN_UP)
    || (
      (formTab === FORM_TABS.SIGN_IN)
      && (id === 'password')
    )
  );

  return (
    isRendered ?
      <input
        className={styles.loginFormInput}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleFieldChange}
      />
    : <></>
  )
};
