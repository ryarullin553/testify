import { useEffect, useState } from 'react';
import styles from './filter-form.module.scss';

export const FilterForm = ({defaultRequest, setBaseRequest}) => {
  const [searchField, setSearchField] = useState('');
  const [filter, setFilter] = useState('all');

  const handleFieldChange = (evt) => {
    const {value} = evt.target;
    setSearchField(value);
  }

  const handleSearchClick = async (evt) => {
    evt.preventDefault();
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }

  const handleFilterChange = (evt) => {
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
    request = request.concat(filterValues.find(i => i.value === filter).appendValue);
    return request;
  }

  useEffect(() => {
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }, [filter])

  const filterValues = [
    { value: 'all', label: 'Все', appendValue: ''},
    { value: 'published', label: 'Опубликованные', appendValue: 'is_published=True'},
    { value: 'unpublished', label: 'Неопубликованные', appendValue: 'is_published=False'},
  ];

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
