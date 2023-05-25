import styles from './catalog-list.module.scss';
import { CatalogTile } from './catalog-tile/catalog-tile';

export const CatalogList = ({testList}) => {
  return (
    <ul className={styles.catalog__items}>
      {testList.map((testItem) => {
        const {id, title, avatar} = testItem;
        const shortAbstract = testItem.description;
        return <CatalogTile key={id} id={id} title={title} avatar={avatar} shortAbstract={shortAbstract}/>
      })}
    </ul>
  );
}
