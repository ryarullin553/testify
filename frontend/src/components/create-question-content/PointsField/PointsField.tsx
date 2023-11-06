import styles from './PointsField.module.scss'
import { FC, FocusEvent } from 'react'

interface Props {
  formID: string
  fieldID: string
  defaultValue?: number
  disabled?: boolean
}

export const PointsField: FC<Props> = ({ formID, fieldID, disabled, defaultValue = 1 }) => {
  const MIN_POINTS = 0
  const MAX_POINTS = 99

  const validateForm = (evt: FocusEvent<HTMLInputElement>) => {
    const { value } = evt.target
    const newVal = String(Math.min(Math.max(Math.round(Number(value)), MIN_POINTS), MAX_POINTS))
    evt.target.value = newVal
  }

  return (
    <label className={styles.label}>
      Баллы
      <input
        type={'number'}
        id={fieldID}
        name={fieldID}
        form={formID}
        min={MIN_POINTS}
        max={MAX_POINTS}
        defaultValue={defaultValue}
        disabled={disabled}
        className={styles.input}
        onBlur={validateForm}
      />
    </label>
  )
}
