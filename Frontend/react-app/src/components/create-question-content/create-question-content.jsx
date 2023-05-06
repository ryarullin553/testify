import { api } from '../../store/index.js';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './create-question-content.module.scss';
import { CreateQuestionManager } from './create-question-manager/create-question-manager';
import { useParams } from 'react-router';
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button.jsx';
import { editTestAction, fetchTestQuestionsAction } from '../../api/tests.js';
import { createQuestionAction, deleteQuestionAction, updateQuestionAction } from '../../api/questions.js';

export const CreateQuestionContent = () => {
  const { testID } = useParams();
  let [testState, setTestState] = useImmer();
  let [currentQuestionID, setCurrentQuestionID] = useState(1);
  
  const getCurrentQuestionData = (state, currentQuestionID) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const getCurrentQuestionIndex = (state, currentQuestionID) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  const isLastQuestion = (state, currentQuestionID) => (getCurrentQuestionIndex(state, currentQuestionID) === (testState.questionList.length - 1));

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      const data = await fetchTestQuestionsAction(testID);
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
    const convertedData = convertQuestionDataCtS(updatedQuestionData);
    await updateQuestionAction(currentQuestionID, convertedData);
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, updatedQuestionData);
    });
  }

  const actionQuestionSave = async (updatedQuestionData) => {
    const convertedData = convertQuestionDataCtS(updatedQuestionData);
    const data = await createQuestionAction(convertedData);
    const newID = data.id;
    console.log(newID);
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, {...updatedQuestionData, questionID: newID});
    });
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
    try {
      await editTestAction(testID, {is_published: true});
      setTestState(draft => {
        draft.isPublished = true;
      });
    } catch {
      return;
    }
  }

  const actionQuestionDelete = async () => {
    const index = getCurrentQuestionIndex(testState, currentQuestionID);
    const deletedID = currentQuestionID;
    const newID = (testState.questionList[index + 1] || testState.questionList[index - 1]).questionID;
    console.log(index, deletedID, newID);
    await deleteQuestionAction(deletedID);
    setCurrentQuestionID(newID);
    setTestState(draft => {
      draft.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === deletedID)), 1);
    });
  }

  const convertTestDataStC = (data) => {
    const convertedData = {
      testTitle: data.title,
      isPublished: data.is_published,
      questionList: data.question_set.map(q => ({
        questionID: q.id,
        questionDescription: q.content,
        answerList: q.answer_set.map((a, i) => ({
          answerID: i,
          answerDescription: a.content,
        })),
        correctAnswerID: q.answer_set.findIndex(a => (a.is_true === true)),
      })),
    }
    return convertedData;
  }

  const convertQuestionDataCtS = (data) => {
    const convertedData = {
      test: testID,
      content: data.questionDescription,
      answer_set: data.answerList.map(a => ({
        content: a.answerDescription,
        is_true: (a.answerID === data.correctAnswerID),
      }))
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
          key={1}
          label={'Новый вопрос'}
          onClickAction={actionQuestionAdd}
          condition={true}
        />
        <QuestionListSidebarButton
          key={2}
          label={'Опубликовать тест'}
          onClickAction={actionTestPublish}
          condition={!testState.isPublished}
        />
      </QuestionListSidebar>
      <CreateQuestionManager
        key={currentQuestionID}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={getCurrentQuestionIndex(testState, currentQuestionID)}
        defaultQuestionData={getCurrentQuestionData(testState, currentQuestionID)}
        actionQuestionUpdate={actionQuestionUpdate}
        actionQuestionSave={actionQuestionSave}
        isLastQuestion={isLastQuestion(testState, currentQuestionID)}
        actionQuestionAdd={actionQuestionAdd}
        actionQuestionDelete={actionQuestionDelete}
      />
    </main>
  );
}
