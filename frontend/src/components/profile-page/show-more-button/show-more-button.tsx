import React, { FC } from 'react';
import styles from './show-more-button.module.scss';

export const ShowMoreButton: FC = () => {
  return(
    <>
      <div className={styles.controls}>
        <button className={styles.button}>Показать все</button>
      </div>
    </>
  );
}
