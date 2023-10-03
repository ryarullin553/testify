import { FC, useEffect, useState } from 'react'
import styles from './like-block.module.scss'
import { fetchQuestionLikesAction } from '../../../api/questions'
import LikeImage from './img/like.svg'
import LikeImageActive from './img/like-active.svg'
import { addLikeAction, changeLikeAction, deleteLikeAction } from '../../../api/likes'

const enum LikeStates {
  Like = 'like',
  Dislike = 'dislike',
  None = 'none',
}

interface Props {
  questionID: number
}

export const LikeBlock: FC<Props> = ({ questionID }) => {
  return (
    <fieldset className={styles.likeField}>
      <label>
        {likeState === LikeStates.Like ? <LikeImageActive /> : <LikeImage />}
        {likeCount.likes}
        <input
          type={'checkbox'}
          name={'like'}
          id={'like'}
          value={LikeStates.Like}
          checked={likeState === LikeStates.Like}
          onClick={handleLikeClick}
        />
      </label>
      <label>
        {likeState === LikeStates.Like ? (
          <LikeImageActive style={{ transform: 'rotate(180deg)' }} />
        ) : (
          <LikeImage style={{ transform: 'rotate(180deg)' }} />
        )}
        {likeCount.dislikes}
        <input
          type={'radio'}
          name={'dislike'}
          id={'dislike'}
          value={LikeStates.Dislike}
          checked={likeState === LikeStates.Dislike}
          onClick={handleLikeClick}
        />
      </label>
    </fieldset>
  )
}
