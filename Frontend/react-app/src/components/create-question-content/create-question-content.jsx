import { api } from '../../store/index.js';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { newTestData } from '../../mocks/new-test-data';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './create-question-content.module.scss';
import { CreateQuestionManager } from './create-question-manager/create-question-manager';
import { useParams } from 'react-router';

export const CreateQuestionContent = () => {
  const { id } = useParams();
  const testID = Number(id);
  let [testState, setTestState] = useImmer(newTestData);
  let [currentQuestionID, setCurrentQuestionID] = useState(1);
  
  const getCurrentQuestionData = (state, currentQuestionID) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const getCurrentQuestionIndex = (state, currentQuestionID) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  let isLastQuestion = (getCurrentQuestionIndex(testState, currentQuestionID) === (testState.questionList.length - 1));

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      const {data} = await api.get(`/test/${testID}/questions/`);
      const convertedData = convertTestDataStC(data, testID);
      setTestState(convertedData);
      if (convertedData.questionList.length === 0) {
        actionQuestionAdd();
      }
      setCurrentQuestionID(convertedData.questionList[0].questionID);
    } catch (err) {
      return;
    }
  }

  const actionQuestionUpdate = async (updatedQuestionData) => {
    await api.put(`/update_question/${currentQuestionID}/`, convertQuestionDataCtS(updatedQuestionData));
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, updatedQuestionData);
    });
  }

  const actionQuestionSave = async (updatedQuestionData) => {
    try {
      const {data} = await api.post(`/test/${testState.testID}/questions/`, convertQuestionDataCtS(updatedQuestionData));
      const newID = data.id;
      setTestState(draft => {
        draft.questionList
          .splice(draft.questionList
            .findIndex(question => (question.questionID === currentQuestionID)),
            1, {...updatedQuestionData, questionID: newID});
      });
    } catch (err) {
      return;
    }
  }

  const actionQuestionAdd = () => {
    const newQuestionID = Math.min(currentQuestionID, 0) - 1;
    setTestState(draft => {
      draft.questionList.push({
        questionID: newQuestionID,
        questionDescription: '',
        answerList: [
          { answerID: 0, answerDescription: '' },
          { answerID: 1, answerDescription: '' },
        ],
      });
    });
    setCurrentQuestionID(newQuestionID);
  }

  const actionTestPublish = async () => {
    await api.put(`/update_test/${testID}/`, {is_published: true});
  }

  const actionQuestionDelete = async () => {
    const index = getCurrentQuestionIndex(testState, currentQuestionID);
    const deletedID = currentQuestionID;
    const newID = (testState.questionList[index + 1] || testState.questionList[index - 1]).questionID;
    console.log(index, deletedID, newID);
    await api.delete(`/update_question/${deletedID}/`);
    setCurrentQuestionID(newID);
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === deletedID)), 1);
    });
  }

  const convertTestDataStC = (data, testID) => {
    const modifiedData = {
      testID: testID,
      testTitle: data.test_title,
      questionList: data.questions.map(q => ({
        questionID: q.id,
        questionDescription: q.content,
        answerList: q.answer_set.map((a, i) => ({
          answerID: i,
          answerDescription: a.content,
        })),
        correctAnswerID: q.answer_set.findIndex(a => (a.is_true === true)),
      })),
    }
    return modifiedData;
  }

  const convertQuestionDataCtS = (data) => {
    const convertedData = {
      question: data.questionDescription,
      answers: data.answerList.map(a => ({
        content: a.answerDescription,
        is_true: (a.answerID === data.correctAnswerID),
      }))
    }
    return convertedData;
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testState.testTitle}
        questionList={testState.questionList}
        setCurrentQuestionID={setCurrentQuestionID}
        actionTestPublish={actionTestPublish}
      />
      <CreateQuestionManager
        key={currentQuestionID}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={getCurrentQuestionIndex(testState, currentQuestionID)}
        defaultQuestionData={getCurrentQuestionData(testState, currentQuestionID)}
        actionQuestionUpdate={actionQuestionUpdate}
        actionQuestionSave={actionQuestionSave}
        isLastQuestion={isLastQuestion}
        actionQuestionAdd={actionQuestionAdd}
        actionQuestionDelete={actionQuestionDelete}
      />
    </main>
  );
}
