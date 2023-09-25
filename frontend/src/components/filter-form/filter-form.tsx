import { ChangeEvent, FC, Dispatch, SetStateAction, FormEvent } from 'react'
import styles from './filter-form.module.scss'
import { FilterValue } from '@/types/Filter'

export interface SearchParams {
  search?: string
  filter?: string
}

interface Props {
  filterValues: FilterValue[]
  setSearchParams: Dispatch<SetStateAction<SearchParams>>
}

export const FilterForm: FC<Props> = ({ filterValues, setSearchParams }) => {
  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const searchParams = Object.fromEntries(formData.entries())
    setSearchParams(searchParams)
  }

  const handleFilterChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target
    setSearchParams((prevState) => ({ ...prevState, filter: value }))
  }

  return (
    <form className={styles.filterForm} onSubmit={handleFormSubmit}>
      <select name='filter' id='filter' defaultValue={filterValues[0].value} onChange={handleFilterChange}>
        {filterValues.map((filterItem) => (
          <option key={filterItem.value} value={filterItem.value}>
            {filterItem.label}
          </option>
        ))}
      </select>
      <input type='search' name='search' id='search' placeholder='Название теста' />
      <button type={'submit'} className={styles.searchButton}>
        Поиск
      </button>
    </form>
  )
}
