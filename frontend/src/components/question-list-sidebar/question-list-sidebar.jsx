import { QUESTION_STATES } from '../test-content/test-content';
import styles from './question-list-sidebar.module.scss';

export const QuestionListSidebar = ({testTitle, questionList, setCurrentQuestionID, children}) => {
  const buttonLabel = (text) => {
    if (text.length === 0) {
      return 'Нет описания';
    } else {
      return text;
    }
  }

  const getQuestionColor = (questionState) => {
    switch (questionState) {
      case QUESTION_STATES.Submitted:
        return '#A5A5A5';
      case QUESTION_STATES.PendingAnswer:
        return 'yellow';
      case QUESTION_STATES.Correct:
        return 'lightgreen';
      case QUESTION_STATES.Incorrect:
        return 'red';
      default: return '';
    }
  }

  return (
    <section className={styles.questionListSection}>
      <h2>{testTitle}</h2>
      <ol>
        {questionList.map(question => 
          <li key={question.questionID} style={{color: getQuestionColor(question.questionState)}}>
            <button
              className={styles.selectQuestionButton}
              onClick={() => setCurrentQuestionID(question.questionID)}
              style={{color: getQuestionColor(question.questionState)}}
            >{buttonLabel(question.questionDescription)}
            </button>
          </li>
        )}
      </ol>
      {children}
    </section>
  );
}
