import { useState } from 'react';
import { CatalogList } from '../catalog-list/catalog-list';
import styles from './catalog-content.module.scss';
import { useScroll } from '../../reusable/hooks';
import { CatalogSearch } from '../catalog-search/catalog-search';

export const CatalogContent = () => {
  const defaultRequest = 'tests/';
  const [testList, setTestList] = useState([]);
  const [baseRequest, setBaseRequest] = useState(defaultRequest);

  useScroll(baseRequest, setTestList);

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.catalog}>
          <CatalogSearch 
            defaultRequest={defaultRequest}
            setBaseRequest={setBaseRequest}
          />
          <CatalogList testList={testList} />
        </div>
      </div>
    </main>
  );
}
