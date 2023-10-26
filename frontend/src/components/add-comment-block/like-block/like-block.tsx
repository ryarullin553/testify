import { FC } from 'react'
import styles from './like-block.module.scss'
import LikeImage from './img/like.svg'
import LikeImageActive from './img/like-active.svg'
import { LikeState } from '@/types/Test'

interface Props {
  likeCount: number
  dislikeCount: number
  likeState: LikeState
}

export const LikeBlock: FC<Props> = ({ likeCount, dislikeCount, likeState }) => {
  return (
    <fieldset className={styles.likeField}>
      <label>
        {likeState === 'like' ? <LikeImageActive /> : <LikeImage />}
        {likeCount}
        <input
          type={'checkbox'}
          name={'like'}
          id={'like'}
          value={'like'}
          checked={likeState === 'like'}
          onChange={handleLikeClick}
        />
      </label>
      <label>
        {likeState === LikeStates.Like ? (
          <LikeImageActive style={{ transform: 'rotate(180deg)' }} />
        ) : (
          <LikeImage style={{ transform: 'rotate(180deg)' }} />
        )}
        {dislikeCount}
        <input
          type={'checkbox'}
          name={'dislike'}
          id={'dislike'}
          value={'dislike'}
          checked={likeState === 'dislike'}
          onChange={handleLikeClick}
        />
      </label>
    </fieldset>
  )
}
