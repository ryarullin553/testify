import { AppRoute } from '../../reusable/const';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from './img/logo.svg';
import styles from './logo.module.scss'
import React, { FC } from 'react';
import { HEX } from '../../types/HEX';

interface Props {
  color: HEX,
}

export const Logo: FC<Props> = ({ color }) => {
  return (
    <Link to={AppRoute.Root} className={styles.logo}>
      <LogoIcon fill={color}/>
      Testify
    </Link>
  );
}
