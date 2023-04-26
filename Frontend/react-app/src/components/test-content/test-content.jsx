import { useNavigate, useParams } from 'react-router';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './test-content.module.scss';
import { api } from '../../store';
import { useEffect, useState } from 'react';
import { AppRoute } from '../../const';
import { QuestionArea } from './question-area/question-area';
import { useImmer } from 'use-immer';
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button';

export const QUESTION_STATES = {
  NoAnswer: 'noAnswer',
  PendingAnswer: 'pendingAnswer',
  Submitted: 'submitted',
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
    const {data} = await api.get(`api/${testID}/results/`);
    const activeAttempt = data.find(attempt => attempt.is_finished === false);
    return activeAttempt;
  }

  const fetchAttemptData = async (attempt) => {
    const {data} = await api.get(`api/result/${attempt}/`);
    return data;
  }
  
  const getActiveAttempt = async (testID) => {
    let attempt = await fetchActiveAttempt(testID);
    if (!attempt) {
      let {data} = await api.post(`api/${testID}/results/`);
      attempt = data;
    }
    const rawData = await fetchAttemptData(attempt.id);
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
    const {data} = await api.post('api/add_anwser/', {
      result: testState.attemptID,
      answer: answerID,
    })
    setTestState(draft => {
      draft.questionList[getCurrentQuestionIndex(testState, questionID)].selectedAnswer.dbEntry = data.id;
    })
  }

  const submitUpdatedAnswer = async (questionData) => {
    const dbEntry = questionData.selectedAnswer.dbEntry;
    const answerID = questionData.selectedAnswer.answerID;
    await api.patch(`api/update_anwser/${dbEntry}/`, {
      result: testState.attemptID,
      answer: answerID,
    })
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
    await api.patch(`api/update_result/${testState.attemptID}/`, {is_finished: true});
    navigate(AppRoute.Root);
  }

  const convertDataStC = (data) => {
    const convertedData = {
      testTitle: data.test_title,
      attemptID: data.result_id,
      questionList: data.questions.map(q => ({
        questionID: q.id,
        questionDescription: q.content,
        questionState: q.choiced_answers[0] ? QUESTION_STATES.Submitted : QUESTION_STATES.NoAnswer,
        answerList: q.answer_set.map(a => ({
          answerID: a.id,
          answerDescription: a.content,
        })),
        selectedAnswer: 
          q.choiced_answers[0]
          ? {
            answerID: q.choiced_answers[0].answer,
            dbEntry: q.choiced_answers[0].id,
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
        submitNewAnswer={submitNewAnswer}
        submitUpdatedAnswer={submitUpdatedAnswer}
        gotoNextQuestion={gotoNextQuestion}
        setQuestionState={setQuestionState}
      />
    </main>
  );
}
