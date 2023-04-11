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
  let [testTest, setTestTest] = useState();

  let isLastQuestion = Math.max(...testState.questionList.map(question => question.questionID)) === currentQuestionID;

  const fetchTestData = async () => {
    try {
      const {data} = await api.get(`/catalog`);
      setTestTest(data);
    } catch (err) {
      return;
    }
  }

  useEffect(() => {
    fetchTestData();
  })
  
  const getCurrentQuestionData = (state) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const actionQuestionSave = (updatedQuestionData) => {
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, updatedQuestionData);
    });
  }

  const actionQuestionAdd = () => {
    setTestState(draft => {
      draft.questionList.push({
        questionID: currentQuestionID + 1,
        questionDescription: '',
        answerList: [
          { answerID: 1, answerDescription: '' },
          { answerID: 2, answerDescription: '' },
        ],
      });
    });
    setCurrentQuestionID(currentQuestionID + 1);
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
        defaultQuestionData={getCurrentQuestionData(testState)}
        actionQuestionSave={actionQuestionSave}
        isLastQuestion={isLastQuestion}
        actionQuestionAdd={actionQuestionAdd}
      />
    </main>
  );
}
