import { FORM_STATES } from '../login-form';
import styles from './login-form-input.module.scss'

export const LoginFormInput = ({type, id, placeholder, formState}) => {
  let isRendered = (
    (id === 'email')
    || (formState === FORM_STATES.SIGN_UP)
    || (
      (formState === FORM_STATES.SIGN_IN)
      && (id === 'password')
    )
  );

  return (
    isRendered ?
      <input
        className={styles.loginFormInput}
        type={type}
        name='sign-form'
        id={id}
        placeholder={placeholder}
        defaultValue=''
      />
    : <></>
  )
};
