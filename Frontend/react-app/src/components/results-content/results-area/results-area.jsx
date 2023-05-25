import styles from './results-area.module.scss';

export const ResultsArea = ({results}) => {
  const {testTitle, answersTotal, answersCorrect, questionsAmount, score, time} = results;

  return (
    <section class={styles.resultContent}>
      <h1>Поздравляем!<br />
        Вы завершили прохождение теста {testTitle}.</h1>
      <div class={styles.resultContainer}>
        <div class={styles.allResults}>
          <p>Вы ответили на <span>{answersTotal}</span> вопросов из <span>{questionsAmount}</span></p>
          <p>Ответили верно на <span>{answersCorrect}</span> вопросов</p>
          <p>Прошли тест лучше чем <span>???</span> пользователей</p>
          <p>Время прохождения теста: <span>{time}</span></p>
        </div>
        <div class={styles.progressBar}>
          <h3>Ваш результат</h3>
          <div class={styles.container}>
            <div class={styles.circularProgress}
              style={{background: `conic-gradient(#A38FFD ${score * 3.6}deg, #fff 0deg)`}}>
              <span class={styles.progressValue}>{score}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class={styles.controls}>
          <button class={styles.feedback}>Оставить отзыв</button>
          <button class={styles.catalog}>Каталог</button>
      </div>
    </section>
  );
}
