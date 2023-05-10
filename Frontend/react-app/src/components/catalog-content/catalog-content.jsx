import { useState } from 'react';
import { CatalogList } from '../catalog-list/catalog-list';
import styles from './catalog-content.module.scss';
import { useScroll } from '../../hooks';

export const CatalogContent = () => {
  const [testList, setTestList] = useState([]);
  const [baseRequest, setBaseRequest] = useState('catalog/');

  useScroll(baseRequest, setTestList);

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.catalog}>
          <div className={styles.catalog__options}>
            <div className={styles.search}>
              <div className={styles.search__input}>
                <img src="img/loupe.svg" alt="Loupe" />
                <input type="text" placeholder="Название теста" />
              </div>
              <button className={styles.search__button}>Поиск</button>
            </div>
            <div className={styles.select}>
              <button className={styles.select__button}>Высокий рейтинг</button>
              <ul className={styles.select__list}>
                <li data-value="high-rating">
                  Высокий рейтинг
                </li>
                <li data-value="popular">
                  Популярные
                </li>
                <li data-value="new">
                  Сначала новые
                </li>
                <li data-value="old">
                  Сначала старые
                </li>
              </ul>
            </div>
          </div>
          <CatalogList testList={testList} />
        </div>
      </div>
    </main>
  );
}
