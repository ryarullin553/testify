import React, { FC } from 'react';
import styles from './error-page-content.module.scss';

export const ErrorPageContent: FC = () => {

  return (
    <main className={styles.pageMain}>
      <div className={styles.container}>
        <h1 className={styles.errorTitle}>Ой! Что-то пошло не так!</h1>
        <p className={styles.errorDescription}>
          Страница была удалена или никогда не существовала
          <br />
          Вы можете создать тест или найти готовый
        </p>
        <div className={styles.errorButtons}>
          <a href='#' className={styles.button}>Создать тест</a>
          <a href='#' className={`${styles.button} ${styles.inversed}`}>Найти тест</a>
        </div>
      </div>
    </main>
  );
}
