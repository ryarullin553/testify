import { useEffect, useState } from 'react';
import styles from './like-block.module.scss';
import { fetchQuestionLikesAction } from '../../../api/questions';
import likeImage from './img/like.svg';
import likeImageActive from './img/like-active.svg';
import { addLikeAction, changeLikeAction, deleteLikeAction } from '../../../api/likes';

const LIKE_STATES = {
  Like: 'like',
  Dislike: 'dislike',
  None: 'none',
}

export const LikeBlock = ({questionID}) => {
  const [likeCount, setLikeCount] = useState({ likes : 0, dislikes: 0 });
  const [likeState, setLikeState] = useState(LIKE_STATES.None);

  const fetchQuestionLikes = async () => {
    const { likes, dislikes, is_like } = await fetchQuestionLikesAction(questionID);
    setLikeState(getLikeState(is_like));
    setLikeCount({ likes, dislikes });
  }

  const getLikeState = (state) => {
    switch (state) {
      case true:
        return LIKE_STATES.Like;
      case false:
        return LIKE_STATES.Dislike;
      default:
        return LIKE_STATES.None;
    }
  }

  const handleLikeClick = async (evt) => {
    const {value} = evt.target;
    if (value === likeState) {
      await deleteLikeAction(questionID);
    } else if (likeState === LIKE_STATES.None) {
      await addLikeAction({ question: questionID, is_like: (!!likeState)});
    } else {
      await changeLikeAction(questionID, {is_like: (!!likeState)});
    }
    fetchQuestionLikes();
  }

  useEffect(() => {
    fetchQuestionLikes();
  }, [])

  return (
    <fieldset className={styles.likeField}>
      <label>
        <img src={likeState === LIKE_STATES.Like ? likeImageActive : likeImage} alt='Нравится' />
        {likeCount.likes}
        <input
          type='radio'
          name='is-liked'
          id='like'
          value={LIKE_STATES.Like}
          checked={likeState === LIKE_STATES.Like}
          onChange={handleLikeClick}
        />
      </label>
      <label>
        <img src={likeState === LIKE_STATES.Dislike ? likeImageActive : likeImage} alt='Не нравится' style={{transform: 'rotate(180deg)'}}/>
        {likeCount.dislikes}
        <input
          type='radio'
          name='is-liked'
          id='dislike'
          value={LIKE_STATES.Dislike}
          checked={likeState === LIKE_STATES.Dislike}
          onChange={handleLikeClick}
        />
      </label>
    </fieldset>
  );
}
