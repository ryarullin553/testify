import styles from './rate-block.module.scss'
import StarChecked from './img/star-checked.svg'
import StarUnchecked from './img/star-unchecked.svg'
import { ChangeEvent, FC } from 'react'

export const RateBlock: FC = () => {
  return (
    <fieldset className={styles.ratingField}>
      <h2 className={styles.legend}>Оцените тест</h2>
      {[...Array(5).keys()].map((num) => (
        <label key={num + 1}>
          <input
            key={num + 1}
            className={styles.ratingInput}
            type='radio'
            name='reviewRating'
            value={num + 1}
            id={`rate-${num + 1}-star`}
          />
        </label>
      ))}
    </fieldset>
  )
}
