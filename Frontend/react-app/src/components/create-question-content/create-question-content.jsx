import { useState } from 'react';
import { useImmer } from 'use-immer';
import { newTestData } from '../../mocks/new-test-data';
import { AnswersInputArea } from './answers-input-area/answers-input-area';
import { QuestionInputArea } from './question-input-area/question-input-area';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import './create-question-page.scss';

export const CreateQuestionContent = () => {
  let [testState, setTestState] = useImmer(newTestData);
  let [currentQuestionID, setCurrentQuestionID] = useState(1);

  const getCurrentQuestionData = (state) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const handleQuestionDescriptionChange = (evt) => {
    const {value} = evt.target;
    setTestState(draft => {
      getCurrentQuestionData(draft).questionDescription = value;
    });
  }

  const handleQuestionAdd = (evt) => {
    evt.preventDefault();
    setTestState(draft => {
      draft.questionList.push({
        questionID: currentQuestionID + 1,
        questionDescription: '',
        answerList: [],
      });
    });
    setCurrentQuestionID(currentQuestionID + 1);
  }

  const handleCorrectAnswerChange = (evt) => {
    const {value} = evt.target;
    setTestState(draft => {
      getCurrentQuestionData(draft).correctAnswerID = +value;
    });
  }

  const handleAnswerDescriptionChange = (evt, answerID) => {
    const {value} = evt.target;
    setTestState(draft => {
      getCurrentQuestionData(draft).answerList
        .find(answer => (answer.answerID === answerID))
        .answerDescription = value;
    });
  }

  const handleAnswerDelete = (evt, answerID) => {
    evt.preventDefault();
    setTestState(draft => {
      getCurrentQuestionData(draft).answerList =
      getCurrentQuestionData(draft).answerList
        .filter(answer => (answer.answerID !== answerID));
    });
  }

  const handleAnswerAdd = (evt) => {
    evt.preventDefault();
    setTestState(draft => {
      const answerList = getCurrentQuestionData(draft).answerList;
      answerList.push({
        answerID: Math.max(...answerList.map(answer => answer.answerID)) + 1,
        answerDescription: '',
      });
    });
  }

  return (
    <main className="page-main">
      <QuestionListSidebar
        testTitle={testState.testTitle}
        questionList={testState.questionList}
        setCurrentQuestionID={setCurrentQuestionID}
      />
      <form className="question-form" action="#" name="question-form">
        <QuestionInputArea
          questionDescription={getCurrentQuestionData(testState).questionDescription}
          handleQuestionDescriptionChange={handleQuestionDescriptionChange}
        />
        <AnswersInputArea
          answerList={getCurrentQuestionData(testState).answerList}
          correctAnswerID={getCurrentQuestionData(testState).correctAnswerID}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAnswerDescriptionChange={handleAnswerDescriptionChange}
          handleAnswerDelete={handleAnswerDelete}
        />
        <div className="controls">
          <button
            className="plus-button"
            onClick={handleAnswerAdd}
          >+</button>
          <button
            className="save-button"
            onClick={handleQuestionAdd}
          >Сохранить вопрос</button>
        </div>
      </form>
    </main>
  );
}
