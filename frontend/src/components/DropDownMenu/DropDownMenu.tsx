import classNames from 'classnames'
import styles from './DropDownMenu.module.scss'
import Link from 'next/link'
import { FC, RefObject, useEffect, useRef } from 'react'

export interface MenuItem {
  id: string
  label: string
  link?: string
  handler?: () => void
}

type MenuList = MenuItem[]

interface Props {
  menuList: MenuList
  closeMenu: () => void
  selectHandler?: (newVal: string) => void
  currentOption?: string
}

export const DropDownMenu: FC<Props> = ({ menuList, closeMenu, selectHandler, currentOption }) => {
  const useOutsideHandler = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      document.addEventListener('click', closeMenu)
      return () => {
        document.removeEventListener('click', closeMenu)
      }
    }, [ref])
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideHandler(wrapperRef)

  const elementConstructor = (menuItem: MenuItem) => {
    const { id, label, link, handler } = menuItem
    if (!!link) {
      return (
        <Link href={link} className={styles.dropdownMenuButton}>
          {label}
        </Link>
      )
    } else if (!!handler) {
      return (
        <button type={'button'} className={styles.dropdownMenuButton} onClick={handler}>
          {label}
        </button>
      )
    } else if (!!selectHandler) {
      return (
        <div
          className={styles.dropdownMenuButton}
          onClick={() => {
            selectHandler(id)
          }}>
          {label}
        </div>
      )
    }
  }

  return (
    <div ref={wrapperRef}>
      <div className={styles.userMenu}>
        <ul>
          {menuList.map((menuItem) => {
            const { id } = menuItem
            return (
              <li key={id} className={classNames(currentOption === id && styles.selected)}>
                {elementConstructor(menuItem)}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
