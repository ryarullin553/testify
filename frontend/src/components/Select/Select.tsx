import { FC } from 'react'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  options: SelectOption[]
  currentValue: string
  handleSelect: (newValue: string) => void
}

export const Select: FC<Props> = ({ options, currentValue, handleSelect }) => {
  return (
    <div className={styles.selectWrapper}>
      <select className={styles.selectInput}>
        {options.map((x) => (
          <option value={x.value}>{x.label}</option>
        ))}
      </select>
    </div>
  )
}
