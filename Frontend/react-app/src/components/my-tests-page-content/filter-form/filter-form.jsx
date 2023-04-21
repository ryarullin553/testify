import { useEffect, useState } from 'react';
import styles from './filter-form.module.scss';

export const FilterForm = ({setTestList, setBaseRequest}) => {
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
    let request = 'api/tests/?';
    if (searchField) {
      request = request.concat(`search=${searchField}`);
      if (filter !== 'all') {
        request = request.concat('&');
      }
    }
    switch (filter) {
      case 'published':
        request = request.concat('is_published=True');
        break;
      case 'unpublished':
        request = request.concat('is_published=False');
        break;
    }
    return request;
  }

  useEffect(() => {
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }, [filter])

  return (
    <form className={styles.filterForm}>
      <select name="filter" id="filter" value={filter} onChange={handleFilterChange}>
        <option value="all">Все</option>
        <option value="published">Опубликованные</option>
        <option value="unpublished">Неопубликованные</option>
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
