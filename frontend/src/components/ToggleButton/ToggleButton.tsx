import { ChangeEvent, FC } from 'react'
import styles from './ToggleButton.module.scss'

interface Props {
  format: 'icon' | 'button'
  defaultChecked: boolean
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void
}

export const ToggleButton: FC<Props> = ({ format, defaultChecked, onChange }) => {
  return (
    <label className={styles[format]}>
      <span>{format === 'button' && 'Хочу пройти'}</span>
      <input type={'checkbox'} defaultChecked={defaultChecked} onChange={onChange} />
    </label>
  )
}
