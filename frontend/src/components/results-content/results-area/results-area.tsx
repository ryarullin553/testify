import styles from './results-area.module.scss';
import { AppRoute } from '../../../reusable/const';
import Link from 'next/link';
import { AttemptComplete } from '../../../types/Test';
import React, { FC } from 'react';

interface Props {
  results: AttemptComplete,
}

export const ResultsArea: FC<Props> = ({ results }) => {
  const {
    testTitle,
    totalAnswers,
    correctAnswers,
    questionAmount,
    attemptScore,
    attemptTime,
    averageScore
  } = results;

  return (
    <section className={styles.resultContent}>
      <h1>Поздравляем!<br />
        Вы завершили прохождение теста {testTitle}.</h1>
      <div className={styles.resultContainer}>
        <div className={styles.allResults}>
          <p>Вы ответили на <span>{totalAnswers}</span> вопросов из <span>{questionAmount}</span></p>
          <p>Ответили верно на <span>{correctAnswers}</span> вопросов</p>
          <p>Средний результат теста <span>{averageScore}%</span></p>
          <p>Время прохождения теста: <span>{attemptTime}</span></p>
        </div>
        <div className={styles.progressBar}>
          <h3>Ваш результат</h3>
          <div className={styles.container}>
            <div className={styles.circularProgress}
              style={{background: `conic-gradient(#A38FFD ${attemptScore * 3.6}deg, #fff 0deg)`}}>
              <span className={styles.progressValue}>{attemptScore}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
          <Link href={AppRoute.Catalog} className={styles.catalog}>В каталог</Link>
      </div>
    </section>
  );
}
