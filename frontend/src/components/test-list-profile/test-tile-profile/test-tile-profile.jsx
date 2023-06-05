import styles from './test-tile-profile.module.scss';
import { TestTileLinks } from './test-tile-links/test-tile-links';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { VisibilityButton } from './visibility-button/visibility-button';
import { TestTileAttemptList } from './test-tile-attempt-list/test-tile-attempt-list';
import { useState } from 'react';
import { fetchAttemptsAction } from '../../../api/tests';

export const TestTileProfile = ({testID, title, avatar, isPublished, linkList, isEditable, isAttemptsAvailiable}) => {
  const [isAttemptsShown, setIsAttemptsShown] = useState(false);
  const [attemptList, setAttemptList] = useState();

  const handleShowAttemptsClick = async (evt) => {
    evt.preventDefault();
    if (!attemptList && isAttemptsAvailiable) {
      await fetchTestAttempts();
    }
    setIsAttemptsShown(!isAttemptsShown);
  }

  const fetchTestAttempts = async () => {
    const data = await fetchAttemptsAction(testID);
    const convertedData = convertDataStC(data);
    setAttemptList(convertedData);
  }
  
  const convertDataStC = (data) => {
    const convertedData = data.results.map(r => ({
      attemptID: r.id,
      testID: testID,
      isComplete: !!r.total,
      score: !!r.total ? r.total.score : undefined,
      date: !!r.total ? new Date(Date.parse(r.total.finished)) : undefined,
    }));
    return convertedData;
  }

  return (
    <li className={styles.testTile}>
      <button className={styles.linkWrapper} onClick={handleShowAttemptsClick}>
        <div className={styles.titleWrapper}>
          <h3>{title}</h3>
          {
            isEditable && <VisibilityButton isPublished={isPublished} testID={testID}/>
          }
        </div>
        <AvatarBlock src={avatar} size={60} additionalStyle={styles.logo}/>
        <TestTileLinks linkList={linkList} testID={testID}/>
        <button className={styles.buttonMore}>...</button>
      </button>
      { isAttemptsAvailiable && isAttemptsShown && !!attemptList && <TestTileAttemptList testID={testID} attemptList={attemptList} /> }
    </li>
  );
}
