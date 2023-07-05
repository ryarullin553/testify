import { FC, PropsWithChildren, useState } from 'react';
import { AvatarBlock } from '../avatar-block/avatar-block';
import styles from './add-comment-block.module.scss';
import { RateBlock } from './rate-block/rate-block';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/selectors';

interface Props extends PropsWithChildren {
  reloadFeedback: () => void,
  hasRateBlock: boolean,
  submitAction: (convertedData: any) => void,
  convertAction: (formState: any) => void,
}

export const AddCommentBlock: FC<Props> = ({
  reloadFeedback,
  hasRateBlock,
  children,
  submitAction,
  convertAction
}) => {
  const {avatar} = useSelector(selectUserInfo);
  const [formState, setFormState] = useState({
    review: '',
  });

  const handleFieldChange = (evt) => {
    const {name, value} = evt.target;
    setFormState({...formState, [name]: value});
  }

  const handleSubmitClick = async (evt) => {
    evt.preventDefault();
    const convertedData = convertAction(formState);
    await submitAction(convertedData);
    await reloadFeedback();
  }

  return (
    <form className={styles.commentForm} name='review-test-form'>
      { hasRateBlock && <RateBlock rating={formState.rating} handleFieldChange={handleFieldChange}/> }
      { children }
      <div className={styles.reviewBlock}>
        <AvatarBlock size={50} src={avatar}/>
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
