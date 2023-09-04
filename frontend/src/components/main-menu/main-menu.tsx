import { FC } from 'react'
import { AppRoute } from '../../reusable/const'
import Link from 'next/link'

interface Props {
  styles: string
}

export const MainMenu: FC<Props> = ({ styles }) => {
  return (
    <ul className={styles}>
      <li>
        <Link href={AppRoute.Catalog}>Каталог</Link>
      </li>
      <li>
        <Link href={AppRoute.CreateTest}>Создать тест</Link>
      </li>
      <li>
        <a href='#'>О нас</a>
      </li>
      <li>
        <a href='#'>Контакты</a>
      </li>
    </ul>
  )
}
