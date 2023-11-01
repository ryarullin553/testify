import { FC, useState } from 'react'
import styles from './Select.module.scss'
import { DropDownMenu } from '../DropDownMenu/DropDownMenu'
import classNames from 'classnames'

interface Props {
  options: Record<string, string>
  currentValue: string
  handleSelect: (newValue: string) => void
}

export const Select: FC<Props> = ({ options, currentValue, handleSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  const optionsArray = Object.entries(options).map(([id, label]) => ({ id, label }))

  const closeMenu = () => {
    setIsOpen(false)
  }

  const openMenu = () => {
    setIsOpen(true)
  }

  return (
    <div className={classNames(styles.selectWrapper, isOpen && styles.active)} onClick={openMenu}>
      <select className={styles.selectInput}>
        {optionsArray.map((x) => (
          <option key={x.id} value={x.id}>
            {x.label}
          </option>
        ))}
      </select>
      {options[currentValue]}
      {isOpen && (
        <DropDownMenu
          closeMenu={closeMenu}
          menuList={optionsArray}
          selectHandler={handleSelect}
          currentOption={currentValue}
        />
      )}
    </div>
  )
}
