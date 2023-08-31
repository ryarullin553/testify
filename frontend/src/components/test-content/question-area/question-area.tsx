import { ChangeEvent, FC, PropsWithChildren } from 'react';
import { CommentsBlock } from '../../comment-block/comment-block';
import styles from './question-area.module.scss';
import { Answer, Question, QuestionState, QuestionWithSelectedAnswer } from '../../../types/Test';

interface Props extends PropsWithChildren {
  questionData: QuestionWithSelectedAnswer,
  questionIndex: number,
  changeCorrectAnswer?: (questionID: Question['questionID'], answerID: Answer['answerID']) => void,
  setQuestionState?: (newState: QuestionState) => void,
  isTogglable?: boolean,
}

export const QuestionArea: FC<Props> = ({
  children,
  questionData,
  questionIndex,
  changeCorrectAnswer,
  setQuestionState,
  isTogglable,
}) => {
  const isChecked = (answerID: Answer['answerID']) => (!!questionData.selectedAnswer && answerID === questionData.selectedAnswer.answerID);

  const handleRadioToggle = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!isTogglable) {
      evt.preventDefault();
      return;
    }
    // Плохо
    if (!changeCorrectAnswer || !setQuestionState) return;
    const {value} = evt.target;
    const numVal = Number(value);
    changeCorrectAnswer(questionData.questionID, numVal);
    setQuestionState(QuestionState.PendingAnswer);
  }

  return (
    <div className={styles.questionArea}>
      <section className={styles.questionSection}>
        <h2>Вопрос №{questionIndex + 1}</h2>
        <p className={styles.questionDescription}>{questionData.questionDescription}</p>
        <p className={styles.notice}>Выберите один вариант из списка</p>
        <form className={styles.answerForm} action='#'>
          <ul>
            {questionData.answerList.map(a => {
              const {answerID, answerDescription} = a;
              const stringAnswerID = String(answerID);
              return (
                <li key={answerID}>
                  <input
                    type='radio'
                    id={stringAnswerID}
                    name='answer-selection'
                    value={answerID}
                    checked={isChecked(answerID)}
                    onChange={handleRadioToggle}
                  />
                  <label htmlFor={stringAnswerID}>{answerDescription}</label>
                </li>
              )
            })}
          </ul>
        </form>
        {children}
      </section>
      <CommentsBlock questionID={questionData.questionID} />
    </div>
  );
}
