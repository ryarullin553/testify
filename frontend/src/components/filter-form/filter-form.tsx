import { ChangeEvent, MouseEvent, FC, useEffect, useState } from 'react';
import styles from './filter-form.module.scss';
import React from 'react';
import { FilterValue } from '../../types/Filter';

interface Props {
  defaultRequest: string,
  setBaseRequest: (newRequest: string) => void,
  filterValues: FilterValue[],
}

export const FilterForm: FC<Props> = ({ defaultRequest, setBaseRequest, filterValues} ) => {
  const [searchField, setSearchField] = useState('');
  const [filter, setFilter] = useState('all');

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const {value} = evt.target;
    setSearchField(value);
  }

  const handleSearchClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }

  const handleFilterChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const {value} = evt.target;
    setFilter(value);
  }

  const composeRequest = () => {
    let request = `${defaultRequest}?`;
    if (searchField) {
      request = request.concat(`search=${searchField}`);
      if (filter !== 'all') {
        request = request.concat('&');
      }
    }
    request = request.concat((filterValues.find(i => i.value === filter) || filterValues[0]).appendValue); // Что-то придумать
    return request;
  }

  useEffect(() => {
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }, [filter])

  return (
    <form className={styles.filterForm}>
      <select name="filter" id="filter" value={filter} onChange={handleFilterChange}>
        {
          filterValues.map(filterItem => <option key={filterItem.value} value={filterItem.value}>{filterItem.label}</option>)
        }
      </select>
      <input
        type='search'
        name='search'
        id='search'
        value={searchField}
        onChange={handleFieldChange}
        placeholder='Название теста'
      />
      <button className={styles.searchButton} onClick={handleSearchClick}>Поиск</button>
    </form>
  );
}
