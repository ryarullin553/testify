import Link from 'next/link'
import { FC, useEffect, useRef, RefObject } from 'react'
import styles from './ProfileMenu.module.scss'
import { AppRoute } from '../../reusable/const'
import { useDispatch } from 'react-redux'
import { userLoggedOut } from '@/store/authSlice'
import { dropToken } from '@/services/token'
import { api } from '@/services/api'

interface Props {
  actionCloseMenu: () => void
}

export const ProfileMenu: FC<Props> = ({ actionCloseMenu }) => {
  const dispatch = useDispatch()

  const handleLogoutClick = async () => {
    dispatch(userLoggedOut)
    dropToken()
    dispatch(api.util.resetApiState())
    actionCloseMenu()
  }

  const useOutsideHandler = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const handleClickOutside = (evt: any) => {
        if (ref.current && !ref.current.contains(evt.target)) {
          actionCloseMenu()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideHandler(wrapperRef)

  const linkList = [
    { id: 1, link: AppRoute.Profile, label: 'Профиль' },
    { id: 2, link: AppRoute.History, label: 'История' },
    { id: 3, link: AppRoute.MyTests, label: 'Мои тесты' },
    { id: 4, link: AppRoute.ProfileBookmark, label: 'Избранное' },
    { id: 5, link: AppRoute.ProfileSetting, label: 'Настройки' },
  ]

  return (
    <div ref={wrapperRef}>
      <div className={styles.userMenu}>
        <ul>
          {linkList.map((linkItem) => (
            <li key={linkItem.id}>
              <Link href={linkItem.link} className={styles.dropdownMenuButton}>
                {linkItem.label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={handleLogoutClick} className={styles.dropdownMenuButton}>
              Выход
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
