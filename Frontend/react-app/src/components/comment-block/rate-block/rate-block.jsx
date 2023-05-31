import styles from './rate-block.module.scss';
import starChecked from './img/star-checked.svg';
import starUnchecked from './img/star-unchecked.svg';

export const RateBlock = ({handleFieldChange, rating}) => {
  return (
    <fieldset className={styles.ratingField}>
      <h2 className={styles.legend}>Оцените тест</h2>
      {
        [...Array(5).keys()].map(num => (
          <label key={num + 1}>
            <img src={(rating >= num + 1) ? starChecked : starUnchecked} alt={`${num + 1} звёзд`}/>
            <input
              key={num + 1}
              className={styles.ratingInput}
              type='radio'
              name='rating'
              value={num + 1}
              id={`rate-${num + 1}-star`}
              checked={rating == num + 1}
              onChange={handleFieldChange}
            />
          </label>
        ))
      }
    </fieldset>
  );
}
