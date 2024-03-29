import styles from './profile-navigation.module.scss'
import { AppRoute } from '../../reusable/const'
import { FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const ProfileNavigation: FC = () => {
  const pathname = usePathname()

  const linkList = [
    { id: 1, link: AppRoute.Profile, label: 'Профиль' },
    { id: 2, link: AppRoute.History, label: 'История' },
    { id: 3, link: AppRoute.MyTests, label: 'Мои тесты' },
    { id: 4, link: AppRoute.ProfileBookmark, label: 'Избранное' },
    { id: 5, link: AppRoute.ProfileSetting, label: 'Настройки' },
  ]

  return (
    <section className={styles.profileNavigation}>
      <ul>
        {linkList.map((linkItem) => {
          const isActive = pathname === linkItem.link
          return (
            <li key={linkItem.id}>
              <Link href={linkItem.link} className={isActive ? styles.activeLink : undefined}>
                {linkItem.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
