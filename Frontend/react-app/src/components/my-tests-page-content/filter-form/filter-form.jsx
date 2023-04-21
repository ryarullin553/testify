import styles from './filter-form.module.scss';

export const FilterForm = () => {
  return (
    <form className={styles.filterForm}>
      <select name="filter" id="filter">
        <option value="all">Все</option>
        <option value="published">Опубликованные</option>
        <option value="unpublished">Неопубликованные</option>
      </select>
      <input type="search" name='search' id='search' placeholder='Название теста'/>
      <button className={styles.searchButton}>Поиск</button>
    </form>
  );
}
