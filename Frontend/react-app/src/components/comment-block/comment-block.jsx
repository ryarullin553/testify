import { useState } from 'react';
import { AvatarBlock } from '../avatar-block/avatar-block';
import styles from './comment-block.module.scss';
import { submitReviewAction } from '../../api/reviews';
import { RateBlock } from './rate-block/rate-block';

export const CommentBlock = ({testID, reloadTestFeedback}) => {
  const [formState, setFormState] = useState({
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
      <RateBlock rating={formState.rating} handleFieldChange={handleFieldChange}/>
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
