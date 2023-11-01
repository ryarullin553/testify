import { useGetTestCompletionsByIDQuery } from '@/services/testCatalogApi'
import styles from './CompletionTable.module.scss'
import { Test } from '@/types/Test'
import { FC } from 'react'
import { Spinner } from '@/components/Spinner/Spinner'
import { AvatarBlock } from '@/components/avatar-block/avatar-block'
import Link from 'next/link'
import { AppRoute } from '@/reusable/const'

interface Props {
  testID: Test['testID']
}

export const CompletionTable: FC<Props> = ({ testID }) => {
  const { data: completionsData } = useGetTestCompletionsByIDQuery(testID)

  if (!completionsData) return <Spinner />

  const tableHeaders = ['Пользователь', 'Результат', 'Баллы', 'Ответы', 'Дата', 'Время', 'Код']

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          {tableHeaders.map((x) => (
            <th scope='col'>{x}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {completionsData.map((completionItem) => {
          const {
            userAvatar,
            userName,
            userID,
            attemptScore,
            questionCount,
            correctAnswerCount,
            finishDate,
            attemptTime,
            codeword,
          } = completionItem
          return (
            <tr>
              <td className={styles.userLinkCell}>
                <Link href={`${AppRoute.Profile}/${userID}`} className={styles.userLink}>
                  <AvatarBlock src={userAvatar} size={40} />
                  {userName}
                </Link>
              </td>
              <td>{attemptScore}%</td>
              <td>TBA</td>
              <td>
                {correctAnswerCount}/{questionCount}
              </td>
              <td>{new Date(Date.parse(finishDate)).toLocaleDateString('ru-Ru')}</td>
              <td>{attemptTime}</td>
              <td>{codeword}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
