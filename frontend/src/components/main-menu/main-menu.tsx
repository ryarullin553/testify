import React, { FC } from 'react';
import { AppRoute } from '../../reusable/const';
import { Link } from 'react-router-dom';

interface Props {
  styles: string,
}

export const MainMenu: FC<Props> = ({ styles }) => {
  return (
    <ul className={styles}>
      <li>
        <Link to={AppRoute.Catalog}>Каталог</Link>
      </li>
      <li>
        <Link to={AppRoute.CreateTest}>Создать тест</Link>
      </li>
      <li>
        <a href="#">О нас</a>
      </li>
      <li>
        <a href="#">Контакты</a>
      </li>
    </ul>
  );
}
