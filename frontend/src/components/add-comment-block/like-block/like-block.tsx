import { FC, useEffect, useState } from 'react';
import styles from './like-block.module.scss';
import { fetchQuestionLikesAction } from '../../../api/questions';
import LikeImage from './img/like.svg';
import LikeImageActive from './img/like-active.svg';
import { addLikeAction, changeLikeAction, deleteLikeAction } from '../../../api/likes';

const enum LikeStates {
  Like = 'like',
  Dislike = 'dislike',
  None = 'none',
}

interface Props {
  questionID: number,
}

export const LikeBlock: FC<Props> = ({ questionID }) => {
  const [likeCount, setLikeCount] = useState({ likes : 0, dislikes: 0 });
  const [likeState, setLikeState] = useState(LikeStates.None);

  const fetchQuestionLikes = async () => {
    const { likes, dislikes, is_like } = await fetchQuestionLikesAction(questionID);
    setLikeState(getLikeState(is_like));
    setLikeCount({ likes, dislikes });
  }

  const getLikeState = (state: boolean | null) => {
    switch (state) {
      case true:
        return LikeStates.Like;
      case false:
        return LikeStates.Dislike;
      default:
        return LikeStates.None;
    }
  }

  // Надо переписать логику radio, возможно поменять на кнопки
  const handleLikeClick = async (evt: any) => {
    const { value } = evt.target;
    if (value === likeState) {
      await deleteLikeAction(questionID);
    } else if (likeState === LikeStates.None) {
      await addLikeAction({ question: questionID, is_like: (value === LikeStates.Like)});
    } else {
      await changeLikeAction(questionID, {is_like: (value === LikeStates.Like)});
    }
    fetchQuestionLikes();
  }

  useEffect(() => {
    fetchQuestionLikes();
  }, [questionID])

  return (
    <fieldset className={styles.likeField}>
      <label>
        {likeState === LikeStates.Like ? <LikeImageActive /> : <LikeImage />}
        {likeCount.likes}
        <input
          type='radio'
          name='is-liked'
          id='like'
          value={LikeStates.Like}
          checked={likeState === LikeStates.Like}
          onClick={handleLikeClick}
        />
      </label>
      <label>
      {likeState === LikeStates.Like ? <LikeImageActive style={{transform: 'rotate(180deg)'}} /> : <LikeImage style={{transform: 'rotate(180deg)'}} />}
        {likeCount.dislikes}
        <input
          type='radio'
          name='is-liked'
          id='dislike'
          value={LikeStates.Dislike}
          checked={likeState === LikeStates.Dislike}
          onClick={handleLikeClick}
        />
      </label>
    </fieldset>
  );
}
