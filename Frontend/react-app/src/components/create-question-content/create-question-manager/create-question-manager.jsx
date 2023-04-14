import { useImmer } from 'use-immer';
import { QuestionInputArea } from '../question-input-area/question-input-area';
import { AnswersInputArea } from '../answers-input-area/answers-input-area';
import styles from './create-question-manager.module.scss';
import { useEffect } from 'react';

export const CreateQuestionManager = ({
  defaultQuestionData,
  actionQuestionUpdate,
  isLastQuestion,
  actionQuestionAdd,
  actionQuestionSave,
  currentQuestionID,
  currentQuestionIndex,
  actionQuestionDelete,
}) => {
  let [currentQuestionData, setCurrentQuestionData] = useImmer(defaultQuestionData);

  useEffect(() => {
    setCurrentQuestionData(defaultQuestionData);
  }, [defaultQuestionData]);

  const actionAnswerDelete = (answerID) => {
    setCurrentQuestionData(draft => {
      draft.answerList =
        draft.answerList.filter(answer => (answer.answerID !== answerID));
    });
  }

  const actionAnswerAdd = () => {
    setCurrentQuestionData(draft => {
      draft.answerList.push({
        answerID: Math.max(...draft.answerList.map(answer => answer.answerID)) + 1,
        answerDescription: '',
      });
    });
  }

  const handleQuestionDescriptionChange = (evt) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.questionDescription = value;
    });
  }

  const handleCorrectAnswerChange = (evt) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.correctAnswerID = +value;
    });
  }

  const handleAnswerDescriptionChange = (evt, answerID) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.answerList
        .find(answer => (answer.answerID === answerID))
        .answerDescription = value;
    });
  }

  const handleAnswerAdd = (evt) => {
    evt.preventDefault();
    actionAnswerAdd();
  }

  const handleQuestionDelete = async (evt) => {
    evt.preventDefault();
    await actionQuestionDelete();
  }

  const handleAnswerDelete = (evt, answerID) => {
    evt.preventDefault();
    actionAnswerDelete(answerID);
    if (currentQuestionData.answerList.length === 2) {
      actionAnswerAdd();
    }
  }

  const handleSaveClick =  async (evt) => {
    evt.preventDefault();
    if (currentQuestionID <= 0) {
      await actionQuestionSave(currentQuestionData);
    } else await actionQuestionUpdate(currentQuestionData);
    if (isLastQuestion) {
      actionQuestionAdd();
    }
  }

  return (
    <form className={styles.questionForm} action="#" name="question-form">
      <QuestionInputArea
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={currentQuestionIndex}
        questionDescription={currentQuestionData.questionDescription}
        handleQuestionDescriptionChange={handleQuestionDescriptionChange}
      />
      <AnswersInputArea
        answerList={currentQuestionData.answerList}
        correctAnswerID={currentQuestionData.correctAnswerID}
        handleCorrectAnswerChange={handleCorrectAnswerChange}
        handleAnswerDescriptionChange={handleAnswerDescriptionChange}
        handleAnswerDelete={handleAnswerDelete}
      />
      <div className={styles.controls}>
        <button
          className={styles.plusButton}
          onClick={handleAnswerAdd}
        >+</button>
        <div className={styles.questionControls}>
        <button
          onClick={handleQuestionDelete}
        >Удалить вопрос</button>
        <button
          onClick={handleSaveClick}
        >Сохранить вопрос</button>
        </div>
      </div>
    </form>
  );
}
