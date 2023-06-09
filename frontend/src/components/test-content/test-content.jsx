import { useNavigate, useParams } from 'react-router';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './test-content.module.scss';
import { useEffect, useState } from 'react';
import { AppRoute } from '../../reusable/const';
import { QuestionArea } from './question-area/question-area';
import { useImmer } from 'use-immer';
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button';
import { fetchAttemptsAction } from '../../api/tests';
import { fetchAttemptAction, submitAttemptAction } from '../../api/results';
import { submitAnswerAction, updateAnswerAction } from '../../api/answers';
import { QuestionControls } from '../question-controls/question-controls';

export const QUESTION_STATES = {
  NoAnswer: 'noAnswer',
  PendingAnswer: 'pendingAnswer',
  Submitted: 'submitted',
  Correct: 'correct',
  Incorrect: 'incorrect',
}

export const TestContent = () => {
  const navigate = useNavigate();
  const { testID } = useParams();
  const [testState, setTestState] = useImmer();
  const [currentQuestionID, setCurrentQuestionID] = useState();

  useEffect(() => {
    getActiveAttempt(testID);
  }, []);

  const getCurrentQuestionData = (state, currentQuestionID) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const getCurrentQuestionIndex = (state, currentQuestionID) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  const fetchActiveAttempt = async (testID) => {
    const attemptList = await fetchAttemptsAction(testID);
    const activeAttempt = attemptList.results.find(a => (!a.total));
    return activeAttempt;
  }
  
  const getActiveAttempt = async (testID) => {
    let attempt = await fetchActiveAttempt(testID);
    if (!attempt) {
      navigate(`${AppRoute.TestDescription}/${testID}`)
    }
    const rawData = await fetchAttemptAction(attempt.id);
    const testData = convertDataStC(rawData);
    setTestState(testData);
    setCurrentQuestionID(testData.questionList[0].questionID);
  }

  const changeCorrectAnswer = (questionID, answerID) => {
    setTestState(draft => {
      draft.questionList[getCurrentQuestionIndex(testState, questionID)].selectedAnswer.answerID = answerID;
    })
  }

  const submitNewAnswer = async (questionID, answerID) => {
    const answerData = {
      result: testState.attemptID,
      answer: answerID,
    }
    const {id} = await submitAnswerAction(answerData);
    setTestState(draft => {
      draft.questionList[getCurrentQuestionIndex(testState, questionID)].selectedAnswer.dbEntry = id;
    })
  }

  const submitUpdatedAnswer = async (questionData) => {
    const dbEntry = questionData.selectedAnswer.dbEntry;
    const answerID = questionData.selectedAnswer.answerID;
    const payload = {
      result: testState.attemptID,
      answer: answerID,
    }
    await updateAnswerAction(dbEntry, payload);
  }

  const setQuestionState = (newState) => {
    setTestState(draft => {
      draft.questionList[getCurrentQuestionIndex(testState, currentQuestionID)].questionState = newState;
    })
  }

  const gotoNextQuestion = () => {
    if (getCurrentQuestionIndex(testState, currentQuestionID) === testState.questionList.length - 1) return;
    
    const newQuestionID = testState.questionList[getCurrentQuestionIndex(testState, currentQuestionID) + 1].questionID;
    setCurrentQuestionID(newQuestionID);
  }

  const submitAttempt = async () => {
    await submitAttemptAction(testState.attemptID);
    navigate(`${AppRoute.Results}/${testState.attemptID}`);
  }

  const convertDataStC = (data) => {
    const convertedData = {
      testTitle: data.passage.title,
      attemptID: data.id,
      questionList: data.passage.question_set.map(q => ({
        questionID: q.id,
        questionDescription: q.content,
        questionState: q.choiced_answer ? QUESTION_STATES.Submitted : QUESTION_STATES.NoAnswer,
        answerList: q.answer_set.map(a => ({
          answerID: a.id,
          answerDescription: a.content,
        })),
        selectedAnswer: 
          q.choiced_answer
          ? {
            answerID: q.choiced_answer.answer,
            dbEntry: q.choiced_answer.id,
          }
          : {},
      })),
    }
    return convertedData;
  }

  if (!testState) return <></>;

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testState.testTitle}
        questionList={testState.questionList}
        setCurrentQuestionID={setCurrentQuestionID}
      >
        <QuestionListSidebarButton
          label={'Завершить тест'}
          onClickAction={submitAttempt}
          condition
        />
      </QuestionListSidebar>
      <QuestionArea
        questionData={getCurrentQuestionData(testState, currentQuestionID)}
        questionIndex={getCurrentQuestionIndex(testState, currentQuestionID)}
        changeCorrectAnswer={changeCorrectAnswer}
        setQuestionState={setQuestionState}
        isTogglable
      >
        <QuestionControls
          questionData={getCurrentQuestionData(testState, currentQuestionID)}
          submitNewAnswer={submitNewAnswer}
          submitUpdatedAnswer={submitUpdatedAnswer}
          gotoNextQuestion={gotoNextQuestion}
          setQuestionState={setQuestionState}
        />
      </QuestionArea>
    </main>
  );
}
