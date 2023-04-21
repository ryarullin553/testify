import { useState } from 'react';
import styles from './filter-form.module.scss';

export const FilterForm = ({setTestList, setBaseRequest}) => {
  const [formState, setFormState] = useState({
    filter: 'all',
    search: '',
  });

  const handleFieldChange = (evt) => {
    const {name, value} = evt.target;
    setFormState({...formState, [name]: value});
  }

  const handleSearchClick = async (evt) => {
    evt.preventDefault();
    setBaseRequest(composeRequest());
  }

  const composeRequest = () => {
    const {search, filter} = formState;
    let request = 'api/tests/';
    console.log(search, filter);
    if (search) {
      request = request.concat(`?search=${search}`);
    }
    switch (filter) {
      case 'published':
        request = request.concat('?is_published=True');
        break;
      case 'unpublished':
        request = request.concat('?is_published=False');
        break;
      }
    console.log(request);
    return request;
  }

  return (
    <form className={styles.filterForm}>
      <select name="filter" id="filter" value={formState.filter} onChange={handleFieldChange}>
        <option value="all">Все</option>
        <option value="published">Опубликованные</option>
        <option value="unpublished">Неопубликованные</option>
      </select>
      <input
        type='search'
        name='search'
        id='search'
        value={formState.search}
        onChange={handleFieldChange}
        placeholder='Название теста'
      />
      <button className={styles.searchButton} onClick={handleSearchClick}>Поиск</button>
    </form>
  );
}
