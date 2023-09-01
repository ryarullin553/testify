import styles from './rate-block.module.scss';
import StarChecked from './img/star-checked.svg';
import StarUnchecked from './img/star-unchecked.svg';
import { ChangeEvent, FC } from 'react';
import { RatingValues } from '../add-comment-block';

interface Props {
  handleFieldChange: (evt: ChangeEvent<HTMLInputElement>) => void,
  rating: RatingValues | null,
}

export const RateBlock: FC<Props> = ({ handleFieldChange, rating }) => {
  return (
    <fieldset className={styles.ratingField}>
      <h2 className={styles.legend}>Оцените тест</h2>
      {
        [...Array(5).keys()].map(num => (
          <label key={num + 1}>
            {(!!rating && rating >= num + 1) ? <StarChecked /> : <StarUnchecked />}
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
