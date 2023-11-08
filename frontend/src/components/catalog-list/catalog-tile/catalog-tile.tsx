import Link from 'next/link'
import styles from './catalog-tile.module.scss'
import { AppRoute } from '../../../reusable/const'
import { AvatarBlock } from '../../avatar-block/avatar-block'
import { FC, ChangeEvent, MouseEvent } from 'react'
import { FeedbackStars } from '../../feedback-stars/feedback-stars'
import UserIcon from './img/user-icon.svg'
import { TestWithDescription } from '../../../types/Test'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'

interface Props {
  testItem: TestWithDescription
}

export const CatalogTile: FC<Props> = ({ testItem }) => {
  const {
    testID,
    testTitle,
    testAvatar,
    testSummary,
    isFavorite,
    testRating,
    testVotesCounter,
    testCompletionCounter,
    authorName,
  } = testItem

  return (
    <li className={styles.card}>
      <article className={styles.linkWrapper}>
        <Link href={`${AppRoute.TestDescription}/${testID}`} className={styles.link} />
        <AvatarBlock src={testAvatar} size={107} />
        <div className={styles.card__info}>
          <div className={styles.card__link}>
            <h3 className={styles.card__title}>{testTitle}</h3>
            <p className={styles.card__description}>{testSummary}</p>
            <div className={styles.card__stats}>
              <div className={styles.card__feedback}>
                <FeedbackStars
                  width={87}
                  height={15}
                  rating={testRating}
                  fill={'#FFFFFF'}
                  id={`catalog-${testID}`}
                  additionalStyles={''}
                />
                <span className={styles.card__feedback__value}>
                  {testRating} ({testVotesCounter})
                </span>
              </div>
              <div className={styles.card__users}>
                <UserIcon />
                <span className={styles.card__users__count}>{testCompletionCounter}</span>
              </div>
              <span className={styles.authorName}>{authorName}</span>
            </div>
          </div>
        </div>
        <FavoriteButton format='icon' defaultChecked={isFavorite} testID={testID} />
      </article>
    </li>
  )
}
