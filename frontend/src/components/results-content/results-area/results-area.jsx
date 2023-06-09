import styles from './results-area.module.scss';
import { AppRoute } from '../../../reusable/const';
import { Link } from 'react-router-dom';

export const ResultsArea = ({results}) => {
  const {testTitle, answersTotal, answersCorrect, questionsAmount, score, time, averageScore} = results;

  return (
    <section className={styles.resultContent}>
      <h1>Поздравляем!<br />
        Вы завершили прохождение теста {testTitle}.</h1>
      <div className={styles.resultContainer}>
        <div className={styles.allResults}>
          <p>Вы ответили на <span>{answersTotal}</span> вопросов из <span>{questionsAmount}</span></p>
          <p>Ответили верно на <span>{answersCorrect}</span> вопросов</p>
          <p>Средний результат теста <span>{parseInt(averageScore)}%</span></p>
          <p>Время прохождения теста: <span>{time}</span></p>
        </div>
        <div className={styles.progressBar}>
          <h3>Ваш результат</h3>
          <div className={styles.container}>
            <div className={styles.circularProgress}
              style={{background: `conic-gradient(#A38FFD ${score * 3.6}deg, #fff 0deg)`}}>
              <span className={styles.progressValue}>{score}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
          <Link to={AppRoute.Catalog} className={styles.catalog}>В каталог</Link>
      </div>
    </section>
  );
}
