import { AppRoute } from '../../reusable/const';
import LogoIcon from './img/logo.svg';
import styles from './logo.module.scss'
import { FC } from 'react';
import { HEX } from '../../types/HEX';
import Link from 'next/link';

interface Props {
  color: HEX,
}

export const Logo: FC<Props> = ({ color }) => {
  return (
    <Link href={AppRoute.Root} className={styles.logo}>
      <LogoIcon color={color}/>
      Testify
    </Link>
  );
}
