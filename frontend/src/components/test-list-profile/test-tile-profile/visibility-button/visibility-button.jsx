import styles from './visibility-button.module.scss';
import hiddenIcon from './img/unpublished.svg';
import visibleIcon from './img/published.svg';
import { changeTestVisibilityAction } from '../../../../api/tests';
import { useState } from 'react';

export const VisibilityButton = ({isPublished, testID}) => {
  const [currentPublishedState, setCurrentPublishedState] = useState(isPublished);

  const toggleIsPublished = async (evt) => {
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
