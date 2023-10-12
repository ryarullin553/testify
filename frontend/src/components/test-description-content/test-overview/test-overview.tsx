import styles from './test-overview.module.scss'
import { FC, PropsWithChildren, useState, MouseEvent, ChangeEvent } from 'react'
import { createAttemptAction } from '../../../api/results'
import { AppRoute } from '../../../reusable/const'
import { addBookmarkAction, deleteBookmarkAction } from '../../../api/bookmarks'
import { FeedbackStars } from '../../feedback-stars/feedback-stars'
import { AvatarBlock } from '../../avatar-block/avatar-block'
import { TestWithDescription } from '../../../types/Test'
import { useRouter } from 'next/navigation'
import { useStartAttemptMutation } from '@/services/testCompletionApi'
import { useCreateTestBookmarkMutation, useRemoveTestBookmarkMutation } from '@/services/testCatalogApi'
import { ToggleButton } from '@/components/ToggleButton/ToggleButton'
import { Button } from '@/components/Button/Button'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'

interface Props extends PropsWithChildren {
  testInfo: TestWithDescription
}

export const TestOverview: FC<Props> = ({ testInfo, children }) => {
  const router = useRouter()
  const [startAttempt] = useStartAttemptMutation()
  const [addBookmark] = useCreateTestBookmarkMutation()
  const [deleteBookmark] = useRemoveTestBookmarkMutation()
  const {
    testID,
    testAvatar,
    testTitle,
    testDescription,
    testSummary,
    testRating,
    testVotesCounter,
    testCompletionCounter,
    authorAvatar,
    authorName,
    authorBio,
    isInProgress,
    isFavorite,
  } = testInfo

  const handleStartTestClick = async () => {
    if (!isInProgress) {
      await startAttempt(testID)
    }
    router.push(`${AppRoute.TestMain}/${testID}`)
  }

  const handleFavoriteClick = async (evt: ChangeEvent<HTMLInputElement>) => {
    const isToggled = evt.target.checked
    if (isToggled) {
      await addBookmark(testID)
    } else {
      await deleteBookmark(testID)
    }
  }

  return (
    <section>
      <header className={styles.title}>
        <div className={styles.descriptionWrapper}>
          <h1 className={styles.title__testName}>{testTitle}</h1>
          <p className={styles.title__testDescription}>{testSummary}</p>
          <div className={styles.feedback}>
            <div className={styles.score}>
              <FeedbackStars width={104.4} height={18} rating={testRating} fill={'#282B41'} id={'test-description'} />
              <span className={styles.rating}>{testRating ?? '?'}</span>
            </div>
            <a href='#reviews' className={styles.feedback__count}>
              {testVotesCounter} отзывов
            </a>
            <div className={styles.feedback__users}>{testCompletionCounter} прохождений</div>
          </div>
        </div>
        <AvatarBlock src={testAvatar} size={168} />
      </header>
      <section className={styles.information}>
        <section className={styles.fullDescription}>
          <div className={styles.test}>
            <h2 className={styles.information__title}>О тесте</h2>
            <p className={styles.fullDescription__description}>{testDescription}</p>
          </div>
          <div className={styles.author}>
            <h2 className={styles.information__title}>Автор</h2>
            <div className={styles.authorContent}>
              <AvatarBlock src={authorAvatar} size={82} />
              <div className={styles.author__data}>
                <h3 className={styles.author__name}>{authorName}</h3>
                <p className={styles.author__info}>{authorBio}</p>
              </div>
            </div>
          </div>
          {children}
        </section>
        <div className={styles.sidebar}>
          <Button type={'button'} view={'rounded'} onClick={handleStartTestClick}>
            {isInProgress ? 'Продолжить' : 'Начать'}
          </Button>
          <FavoriteButton format={'button'} defaultChecked={isFavorite} onChange={handleFavoriteClick} />
        </div>
      </section>
    </section>
  )
}
