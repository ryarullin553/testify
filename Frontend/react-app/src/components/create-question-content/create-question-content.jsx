import { api } from '../../store/index.js';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { newTestData } from '../../mocks/new-test-data';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './create-question-content.module.scss';
import { CreateQuestionManager } from './create-question-manager/create-question-manager';

export const CreateQuestionContent = () => {
  let [testState, setTestState] = useImmer(newTestData);
  let [currentQuestionID, setCurrentQuestionID] = useState(1);

  const fetchTestData = async () => {
    try {
      const {data} = await api.get(`/test/31/questions/`);
      let modifiedData = {
        testID: 31,
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
      setTestState(modifiedData);
      setCurrentQuestionID(modifiedData.questionList[0].questionID);
    } catch (err) {
      return;
    }
  }

  useEffect(() => {
    fetchTestData();
  }, []);

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
  
  const getCurrentQuestionData = (state) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const getCurrentQuestionIndex = (state) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  let isLastQuestion = (getCurrentQuestionIndex(testState) === (testState.questionList.length - 1));

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
    const {newID} = await api.post(`/test/${testState.testID}/questions/`, convertQuestionDataCtS(updatedQuestionData));
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, {...updatedQuestionData, questionID: newID});
    });
  }

  const actionQuestionAdd = () => {
    console.log('henlow');
    setTestState(draft => {
      draft.questionList.push({
        questionID: 0,
        questionDescription: '',
        answerList: [
          { answerID: 0, answerDescription: '' },
          { answerID: 1, answerDescription: '' },
        ],
      });
    });
    setCurrentQuestionID(0);
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testState.testTitle}
        questionList={testState.questionList}
        setCurrentQuestionID={setCurrentQuestionID}
      />
      <CreateQuestionManager
        key={currentQuestionID}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={getCurrentQuestionIndex(testState)}
        defaultQuestionData={getCurrentQuestionData(testState)}
        actionQuestionUpdate={actionQuestionUpdate}
        actionQuestionSave={actionQuestionSave}
        isLastQuestion={isLastQuestion}
        actionQuestionAdd={actionQuestionAdd}
      />
    </main>
  );
}
