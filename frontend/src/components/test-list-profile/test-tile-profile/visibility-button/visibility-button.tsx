import styles from './visibility-button.module.scss';
import hiddenIcon from './img/unpublished.svg';
import visibleIcon from './img/published.svg';
import { changeTestVisibilityAction } from '../../../../api/tests';
import { FC, useState, MouseEvent } from 'react';
import React from 'react';
import { Test } from '../../../../types/Test';

interface Props {
  testID: Test['testID'],
  isPublished?: boolean,
}

export const VisibilityButton: FC<Props> = ({ isPublished, testID }) => {
  const [currentPublishedState, setCurrentPublishedState] = useState(isPublished);

  const toggleIsPublished = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (isPublished) {
      await changeTestVisibilityAction(testID, false);
    } else {
      await changeTestVisibilityAction(testID, true);
    }
    setCurrentPublishedState(!currentPublishedState);
  }

  return (
    <button className={styles.visibilityButton} onClick={toggleIsPublished}>
      <img
        className={styles.visibilityIcon}
        src={currentPublishedState ? visibleIcon : hiddenIcon}
        alt=""
      />
    </button>
  );
}
