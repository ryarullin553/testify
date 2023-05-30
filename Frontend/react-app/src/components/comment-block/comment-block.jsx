import { useState } from 'react';
import { AvatarBlock } from '../avatar-block/avatar-block';
import styles from './comment-block.module.scss';
import { submitReviewAction } from '../../api/reviews';

export const CommentBlock = ({testID, reloadTestFeedback}) => {
  const [formState, setFormState] = useState({
    rating: null,
    review: '',
  });

  const handleFieldChange = (evt) => {
    const {name, value} = evt.target;
    setFormState({...formState, [name]: value});
  }

  const handleSubmitClick = async (evt) => {
    evt.preventDefault();
    const newReviewData = {
      test: testID,
      content: formState.review,
      rate: formState.rating,
    }
    await submitReviewAction(newReviewData);
    await reloadTestFeedback();
  }

  return (
    <form className={styles.commentForm} name='review-test-form'>
      <fieldset className={styles.ratingField}>
        <h2 className={styles.legend}>Оцените тест</h2>
        {
          [...Array(5).keys()].map(num => (
            <input
              key={num + 1}
              className={styles.ratingInput}
              type='radio'
              name='rating'
              value={num + 1}
              id={`rate-${num + 1}-star`}
              checked={formState.rating == num + 1}
              onChange={handleFieldChange}
            />
          ))
        }
        {/* <FeedbackStars width={137.62} height={23.73} rating={2.2} fill={'#FFFFFF'} id={'rate-test'} additionalStyles={styles.feedbackStars}/> */}
      </fieldset>
      <div className={styles.reviewBlock}>
        <AvatarBlock size={50}/>
        <textarea
          name='review'
          placeholder='Напишите что думаете'
          onChange={handleFieldChange}
          value={formState.review}
        /> 
      </div>
      <button className={styles.submitButton} onClick={handleSubmitClick}>Оставить отзыв</button>
    </form>
  );
}
