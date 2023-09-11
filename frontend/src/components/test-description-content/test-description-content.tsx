'use client'

import styles from './test-description-content.module.scss'
import { useParams } from 'next/navigation'
import { TestOverview } from './test-overview/test-overview'
import { ReviewsBlock } from '../reviews-block/reviews-block'
import { TestReview } from '../reviews-block/test-review/test-review'
import { fetchTestInfoAction } from '../../api/tests'
import { FC, useEffect, useState } from 'react'
import { Test, TestWithDescription } from '../../types/Test'

export const TestDescriptionContent: FC = () => {
  const testID = Number(useParams().testID)
  const [testInfo, setTestInfo] = useState<TestWithDescription>()

  const fetchTestInfo = async (testID: Test['testID']) => {
    const data = await fetchTestInfoAction(testID)
    const testData = convertTestDataStC(data)
    setTestInfo(testData)
  }

  const setIsFavorite = (newValue: boolean) => {
    if (!testInfo) return
    setTestInfo({ ...testInfo, isFavorite: newValue })
  }

  const convertTestDataStC = (data: any): TestWithDescription => {
    const modifiedData: TestWithDescription = {
      testID: data.id,
      testTitle: data.title,
      testSummary: data.description,
      testDescription: data.full_description,
      testAvatar: data.avatar,
      isFavorite: data.in_bookmarks,
      isInProgress: data.is_passage,
      testRating: data.rating,
      testVotesCounter: data.feedbacks_count,
      testCompletionCounter: data.results_count,
      authorAvatar: data.user_avatar,
      authorBio: data.user_bio,
      authorName: data.user_name,
    }
    return modifiedData
  }

  useEffect(() => {
    fetchTestInfo(testID)
  }, [])

  if (!testInfo) return <></>

  return (
    <main className={styles.main}>
      <TestOverview testInfo={testInfo} setIsFavorite={setIsFavorite}>
        <ReviewsBlock testID={testID}>
          <TestReview rating={testInfo.testRating} ratingCounter={testInfo.testVotesCounter} />
        </ReviewsBlock>
      </TestOverview>
    </main>
  )
}
