import { useImmer } from 'use-immer';
import { QuestionInputArea } from '../question-input-area/question-input-area';
import { AnswersInputArea } from '../answers-input-area/answers-input-area';
import styles from './create-question-manager.module.scss';

export const CreateQuestionManager = ({
  defaultQuestionData,
  actionQuestionSave,
  isLastQuestion,
  actionQuestionAdd,
  currentQuestionID
}) => {
  let [currentQuestionData, setCurrentQuestionData] = useImmer(defaultQuestionData);

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

  const handleAnswerDelete = (evt, answerID) => {
    evt.preventDefault();
    actionAnswerDelete(answerID);
    if (currentQuestionData.answerList.length === 2) {
      actionAnswerAdd();
    }
  }

  const handleSaveClick = (evt) => {
    evt.preventDefault();
    actionQuestionSave(currentQuestionData);
    if (isLastQuestion) {
      actionQuestionAdd();
    }
  }

  return (
    <form className={styles.questionForm} action="#" name="question-form">
      <QuestionInputArea
        currentQuestionID={currentQuestionID}
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
        <button
          className={styles.saveButton}
          onClick={handleSaveClick}
        >Сохранить вопрос</button>
      </div>
    </form>
  );
}
