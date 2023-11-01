import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import styles from './Button.module.scss'
import classNames from 'classnames'
import Link from 'next/link'

type View = 'normal' | 'sidebar' | 'rounded' | 'thin' | 'flat'
type ColorTheme = 'default' | 'inversed' | 'hoverDark' | 'dark'

interface Props extends PropsWithChildren {
  href?: string
  label?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  outerStyles?: string
  view?: View
  widthMax?: boolean
  colorTheme?: ColorTheme
  disabled?: boolean
}

export const Button: FC<Props> = ({
  children,
  href,
  type,
  onClick,
  outerStyles,
  view = 'normal',
  colorTheme = 'default',
  widthMax,
  disabled,
}) => {
  if (!!href)
    return (
      <Link
        href={href}
        className={classNames(
          styles.innerStyle,
          styles[view],
          styles[colorTheme],
          widthMax && styles.widthMax,
          outerStyles
        )}>
        {children}
      </Link>
    )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.innerStyle,
        styles[view],
        styles[colorTheme],
        widthMax && styles.widthMax,
        outerStyles
      )}>
      {children}
    </button>
  )
}
