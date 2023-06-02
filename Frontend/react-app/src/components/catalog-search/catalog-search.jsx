import { useEffect, useState } from 'react';
import styles from './catalog-search.module.scss';

export const CatalogSearch = ({defaultRequest, setBaseRequest}) => {
  const [searchField, setSearchField] = useState('');
  const [sort, setSort] = useState('new');

  const handleFieldChange = (evt) => {
    const {value} = evt.target;
    setSearchField(value);
  }

  const handleSearchClick = async (evt) => {
    evt.preventDefault();
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }

  const handleSortChange = (evt) => {
    const {value} = evt.target;
    setSort(value);
  }

  const composeRequest = () => {
    let request = `${defaultRequest}?`;
    request = request.concat(sortValues.find(i => i.value === sort).appendValue);
    if (searchField) {
      request = request.concat(`&search=${searchField}`);
    }
    return request;
  }

  useEffect(() => {
    const newRequest = composeRequest();
    setBaseRequest(newRequest);
  }, [sort])

  const sortValues = [
    { value: 'best', label: 'Высокий рейтинг', appendValue: 'ordering=-rating'},
    { value: 'popular', label: 'Популярные', appendValue: 'ordering=-results_count'},
    { value: 'new', label: 'Сначала новые', appendValue: 'ordering=-created'},
    { value: 'old', label: 'Сначала старые', appendValue: 'ordering=created'},
  ];

  return (
    <form className={styles.catalog__options}>
      <div className={styles.search}>
        <div className={styles.search__input}>
          <input
            type='search'
            name='search'
            id='search'
            placeholder='Название теста'
            onChange={handleFieldChange}
          />
        </div>
        <button className={styles.search__button} onClick={handleSearchClick}>Поиск</button>
      </div>
      <div className={styles.select}>
        <select
          name="sort"
          id="sort"
          value={sort}
          className={styles.select__button}
          onChange={handleSortChange}
        >
          {
            sortValues.map(sortItem => <option key={sortItem.value} value={sortItem.value}>{sortItem.label}</option>)
          }
        </select>
      </div>
    </form>
  );
}
