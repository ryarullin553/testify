import React, { FC, FormEvent, MouseEvent } from 'react';
import styles from './question-controls.module.scss';
import { Answer, Question, QuestionState, QuestionWithSelectedAnswer } from '../../types/Test';

interface Props {
  questionData: QuestionWithSelectedAnswer,
  setQuestionState: (questionState: QuestionState) => void,
  submitNewAnswer: (questionID: Question['questionID'], answerID: Answer['answerID']) => Promise<void>,
  submitUpdatedAnswer: (questionData: QuestionWithSelectedAnswer) => Promise<void>,
  gotoNextQuestion: () => void,
}

export const QuestionControls: FC<Props> = ({
  questionData,
  setQuestionState,
  submitNewAnswer,
  submitUpdatedAnswer,
  gotoNextQuestion,
}) => {
  const handleSubmitClick = async (evt: FormEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (questionData.selectedAnswer.dbEntry) {
      await submitUpdatedAnswer(questionData);
    } else {
      await submitNewAnswer(questionData.questionID, questionData.selectedAnswer.answerID);
    }
    setQuestionState(QuestionState.Submitted);
    gotoNextQuestion();
  }

  const handleNextClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    gotoNextQuestion();
  }

  return (
    <div className={styles.questionControls}>
      <button
        onSubmit={handleSubmitClick}
      >Ответить</button>
      <button
        onClick={handleNextClick}
      >Следующий вопрос</button>
    </div>
  );
}
