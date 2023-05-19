import styles from './reset-password-content.module.scss';
import { ResetPasswordComponent } from './reset-password-component/reset-password-component';

export const ResetPasswordContent = () => {

  return (
    <div className={styles.main}>
      < ResetPasswordComponent />
    </div>
  );
}
