import { ChangeEvent, FC } from 'react'
import styles from './FavoriteButton.module.scss'

interface Props {
  format: 'icon' | 'button'
  defaultChecked: boolean
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void
}

export const FavoriteButton: FC<Props> = ({ format, defaultChecked, onChange }) => {
  return (
    <label className={styles[format]}>
      <span>{format === 'button' && 'Хочу пройти'}</span>
      <input type={'checkbox'} defaultChecked={defaultChecked} onChange={onChange} />
    </label>
  )
}
