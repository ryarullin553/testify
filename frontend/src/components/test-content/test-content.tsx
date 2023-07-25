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
import React from 'react';
import { Answer, Attempt, AttemptComplete, Question, QuestionState, Test, TestWithQuestions } from '../../types/Test';

// Тут жесть, надо разбить на компоненты, пересмотреть типы

export const TestContent = () => {
  const navigate = useNavigate();
  const testID = Number(useParams().testID);
  const [testState, setTestState] = useImmer<Attempt | null>(null);
  const [currentQuestionID, setCurrentQuestionID] = useState(0);

  useEffect(() => {
    getActiveAttempt(testID);
  }, []);

  const getCurrentQuestionData = (state: Attempt, currentQuestionID: Question['questionID']) => state.questionList
    .find(question => (question.questionID === currentQuestionID)) || state.questionList[0];

  const getCurrentQuestionIndex = (state: Attempt, currentQuestionID: Question['questionID']) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  const fetchActiveAttempt = async (testID: Test['testID']) => {
    const attemptList = await fetchAttemptsAction(testID);
    const activeAttempt = attemptList.results.find((a: AttemptComplete) => (!a.totalAnswers));
    return activeAttempt;
  }

  if (!testState) return <></>;
  
  const getActiveAttempt = async (testID: Test['testID']) => {
    let attempt = await fetchActiveAttempt(testID);
    if (!attempt) {
      navigate(`${AppRoute.TestDescription}/${testID}`)
    }
    const rawData = await fetchAttemptAction(attempt.id);
    const testData = convertDataStC(rawData);
    setTestState(testData);
    setCurrentQuestionID(testData.questionList[0].questionID);
  }

  const changeCorrectAnswer = (questionID: Question['questionID'], answerID: Answer['answerID']) => {
    setTestState(draft => {
      if (!draft) return;
      draft.questionList[getCurrentQuestionIndex(testState, questionID)].selectedAnswer.answerID = answerID;
    })
  }

  const submitNewAnswer = async (questionID: Question['questionID'], answerID: Answer['answerID']) => {
    const answerData = {
      result: testState?.attemptID,
      answer: answerID,
    }
    const {id} = await submitAnswerAction(answerData);
    setTestState(draft => {
      if (!draft) return;
      draft.questionList[getCurrentQuestionIndex(testState, questionID)].selectedAnswer.dbEntry = id;
    })
  }

  const submitUpdatedAnswer = async (questionData: Question) => {
    const dbEntry = questionData.selectedAnswer?.dbEntry;
    const answerID = questionData.selectedAnswer?.answerID;
    const payload = {
      result: testState?.attemptID,
      answer: answerID,
    }
    await updateAnswerAction(dbEntry, payload);
  }

  const setQuestionState = (newState: QuestionState) => {
    setTestState(draft => {
      if (!draft) return;
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

  const convertDataStC = (data: any): Attempt => {
    const convertedData: Attempt = {
      testID: testID,
      testTitle: data.passage.title,
      attemptID: data.id,
      questionList: data.passage.question_set.map((q: any) => ({
        questionID: q.id,
        questionDescription: q.content,
        questionState: q.choiced_answer ? QuestionState.Submitted : QuestionState.NoAnswer,
        answerList: q.answer_set.map((a: any) => ({
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
