import styles from './catalog-list.module.scss';
import { CatalogTile } from './catalog-tile/catalog-tile';

export const CatalogList = ({testList}) => {
  return (
    <ul className={styles.catalog__items}>
      {testList.map((testItem) => {
        const {id, title, avatar, rating} = testItem;
        const shortAbstract = testItem.description;
        const isFavorite = testItem.in_bookmarks;
        const ratingCounter = testItem.feedbacks_count;
        const completitionCounter = testItem.results_count;
        return (
          <CatalogTile
            key={id}
            id={id}
            title={title}
            avatar={avatar}
            shortAbstract={shortAbstract}
            isFavorite={isFavorite}
            rating={rating}
            ratingCounter={ratingCounter}
            completitionCounter={completitionCounter}
          />
        )
      })}
    </ul>
  );
}
