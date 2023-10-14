import { ChangeEvent, FC, PropsWithChildren } from 'react'
import styles from './ToggleButton.module.scss'
import classNames from 'classnames'

interface Props extends PropsWithChildren {
  defaultChecked: boolean
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void
  outerStyles: string
}

export const ToggleButton: FC<Props> = ({ defaultChecked, onChange, outerStyles, children }) => {
  return (
    <label className={classNames(styles.innerStyles, outerStyles)}>
      {children}
      <input type={'checkbox'} defaultChecked={defaultChecked} onChange={onChange} />
    </label>
  )
}
