import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import styles from './Button.module.scss'
import classNames from 'classnames'

type View = 'normal' | 'sidebar' | 'rounded' | 'thin' | 'flat'
type ColorTheme = 'default' | 'inversed' | 'hoverDark' | 'dark'

interface Props extends PropsWithChildren {
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
  type,
  onClick,
  outerStyles,
  view = 'normal',
  colorTheme = 'default',
  widthMax,
  disabled,
}) => {
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
