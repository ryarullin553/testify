import { AppRoute } from '../../const';
import { Link } from 'react-router-dom';
import logo from './img/logo.svg';
import logoLight from './img/logo-light.svg';

export const Logo = ({styles, isLight}) => {
  return (
    <Link to={AppRoute.Root} className={styles}>
      <img src={isLight ? logoLight : logo} alt="Логотип" />
      Testify
    </Link>
  );
}
