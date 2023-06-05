import { AppRoute } from '../../reusable/const';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from './img/logo.svg';
import styles from './logo.module.scss'

export const Logo = ({color}) => {
  return (
    <Link to={AppRoute.Root} className={styles.logo}>
      <LogoIcon alt="Логотип" fill={color}/>
      Testify
    </Link>
  );
}
