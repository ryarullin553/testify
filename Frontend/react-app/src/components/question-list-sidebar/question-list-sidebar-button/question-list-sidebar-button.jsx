import styles from './question-list-sidebar-button.module.scss';

export const QuestionListSidebarButton = ({onClickAction, label, condition}) => {
  const handleOnClick = (evt) => {
    evt.preventDefault();
    onClickAction();
  }

  return (
    condition && <button className={styles.submitTestButton} onClick={handleOnClick}>{label}</button>
  );
}
