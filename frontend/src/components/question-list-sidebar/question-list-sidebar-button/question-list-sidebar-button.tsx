import { FC, MouseEvent } from 'react';
import styles from './question-list-sidebar-button.module.scss';
import React from 'react';

interface Props {
  onClickAction: () => void,
  label: string,
  condition: boolean,
}

export const QuestionListSidebarButton: FC<Props> = ({ onClickAction, label, condition }) => {
  const handleOnClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    onClickAction();
  }

  return (
    condition ? <button className={styles.sidebarButton} onClick={handleOnClick}>{label}</button> : null
  );
}
