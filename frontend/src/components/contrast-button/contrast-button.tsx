import { FC } from 'react'
import styles from './contrast-button.module.scss'
import Link from 'next/link'

interface Props {
  type: string
  label: string
  inversed: boolean
  onClick?: () => void
  link?: string
}

export const ContrastButton: FC<Props> = ({ type, label, inversed, onClick, link }) => {
  let elem = <></>
  let buttonStyle = styles.contrastButton
  if (inversed) {
    buttonStyle += ` ${styles.inversed}`
  }
  if (type === 'button') {
    elem = (
      <button className={buttonStyle} onClick={onClick}>
        {label}
      </button>
    )
  } else if (type === 'link') {
    elem = (
      <Link className={buttonStyle} href={link || '#'}>
        {label}
      </Link>
    )
  }

  return elem
}
