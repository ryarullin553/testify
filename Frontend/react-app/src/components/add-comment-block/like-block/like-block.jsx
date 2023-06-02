import { useEffect, useState } from 'react';
import styles from './like-block.module.scss';
import { fetchQuestionLikesAction } from '../../../api/questions';
import likeImage from './img/like.svg';

const LIKE_STATES = {
  Like: 'like',
  Dislike: 'dislike',
  None: 'none',
}

export const LikeBlock = ({questionID}) => {
  const [likeCount, setLikeCount] = useState({ likes : 0, dislikes: 0 });
  const [likeState, setLikeState] = useState(LIKE_STATES.None);

  const fetchQuestionLikes = async () => {
    const { likes, dislikes } = await fetchQuestionLikesAction(questionID);
    
    setLikeCount({ likes, dislikes });
  }

  useEffect(() => {
    fetchQuestionLikes();
  }, [])

  return (
    <fieldset className={styles.likeField}>
      <label>
        <img src={likeImage} alt='Нравится' />
        {likeCount.likes}
        <input
          type='radio'
          name='is-liked'
          id='like'
        />
      </label>
      <label>
        <img src={likeImage} alt='Нравится' style={{transform: 'rotate(180deg)'}}/>
        {likeCount.dislikes}
        <input
          type='radio'
          name='is-liked'
          id='dislike'
        />
      </label>
    </fieldset>
  );
}
