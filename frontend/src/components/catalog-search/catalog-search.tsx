import { ChangeEvent, MouseEvent, FC, useEffect, useState, FormEvent, SetStateAction, Dispatch } from 'react'
import styles from './catalog-search.module.scss'
import { SearchParams } from '../catalog-content/catalog-content'

interface Props {
  setSearchParams: Dispatch<SetStateAction<SearchParams>>
}

export const CatalogSearch: FC<Props> = ({ setSearchParams }) => {
  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const searchParams = {
      search: formData.get('search') as string,
      sort: (formData.get('sort') as string) ?? '-rating',
    }
    setSearchParams(searchParams)
  }

  const handleSortChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.currentTarget
    setSearchParams((prevState) => ({ ...prevState, sort: value }))
  }

  interface SortValue {
    value: string
    label: string
  }

  const sortValues: SortValue[] = [
    { value: '-rating', label: 'Высокий рейтинг' },
    { value: '-results_count', label: 'Популярные' },
    { value: '-created', label: 'Сначала новые' },
    { value: 'created', label: 'Сначала старые' },
  ]

  return (
    <form className={styles.catalog__options} onSubmit={handleFormSubmit}>
      <div className={styles.search}>
        <div className={styles.search__input}>
          <input type='search' name='search' id='search' placeholder='Название теста' />
        </div>
        <button type={'submit'} className={styles.search__button}>
          Поиск
        </button>
      </div>
      <div className={styles.select}>
        <select
          name='sort'
          id='sort'
          defaultValue={sortValues[0].label}
          className={styles.select__button}
          onChange={handleSortChange}>
          {sortValues.map((sortItem) => (
            <option key={sortItem.value} value={sortItem.value}>
              {sortItem.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
