'use client'

import { FC, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import styles from './create-question-content.module.scss';
import { CreateQuestionManager } from './create-question-manager/create-question-manager';
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button';
import { changeTestVisibilityAction, editTestAction, fetchTestQuestionsAction } from '../../api/tests.js';
import { createQuestionAction, deleteQuestionAction, updateQuestionAction } from '../../api/questions.js';
import { AppRoute } from '../../reusable/const';
import { Question, TestWithQuestions } from '../../types/Test';
import { useParams, useRouter } from 'next/navigation';

export const CreateQuestionContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)
  const router = useRouter()
  const [testState, setTestState] = useImmer<TestWithQuestions | null>(null);
  const [currentQuestionID, setCurrentQuestionID] = useState(1);
  
  const getCurrentQuestionData = (
    state: TestWithQuestions,
    currentQuestionID: Question['questionID'],
  ) => state.questionList.find(question => (question.questionID === currentQuestionID)) || state.questionList[0];

  const getCurrentQuestionIndex = (
    state: TestWithQuestions,
    currentQuestionID: Question['questionID'],
  ) => state.questionList.findIndex(question => (question.questionID === currentQuestionID));

  const isLastQuestion = (
    state: TestWithQuestions,
    currentQuestionID: Question['questionID'],
    ) => getCurrentQuestionIndex(state, currentQuestionID) === (state.questionList.length - 1);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    const data = await fetchTestQuestionsAction(testID);
    const convertedData = convertTestDataStC(data);
    setTestState(convertedData);
    if (convertedData.questionList.length === 0) {
      actionQuestionAdd();
    }
    setCurrentQuestionID(convertedData.questionList[0]?.questionID || 0);
  }

  const actionQuestionUpdate = async (updatedQuestionData: Question) => {
    const convertedData = convertQuestionDataCtS(updatedQuestionData);
    await updateQuestionAction(currentQuestionID, convertedData);
    setTestState(draft => {
      draft?.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, updatedQuestionData);
    });
  }

  const actionQuestionSave = async (updatedQuestionData: Question) => {
    const convertedData = convertQuestionDataCtS(updatedQuestionData);
    const data = await createQuestionAction({...convertedData, test: testID});
    const newID = data;
    setTestState(draft => {
      draft?.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === currentQuestionID)),
          1, {...updatedQuestionData, questionID: newID});
    });
    setCurrentQuestionID(newID);
  }

  const actionQuestionAdd = () => {
    const newQuestionID = Math.min(currentQuestionID, 0) - 1;
    setTestState(draft => {
      draft?.questionList.push({
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
    await changeTestVisibilityAction(testID, (true));
    router.push(`${AppRoute.TestDescription}/${testID}`);
  }

  const actionQuestionDelete = async () => {
    if (!testState) return;
    const index = getCurrentQuestionIndex(testState, currentQuestionID);
    const deletedID = currentQuestionID;
    const newID = (testState.questionList[index + 1] || testState.questionList[index - 1]).questionID;
    console.log(index, deletedID, newID);
    await deleteQuestionAction(deletedID);
    setCurrentQuestionID(newID);
    setTestState(draft => {
      draft?.questionList
        .splice(draft.questionList
          .findIndex(question => (question.questionID === deletedID)), 1);
    });
  }

  const convertTestDataStC = (data: any): TestWithQuestions => {
    const convertedData = {
      testID: testID,
      testTitle: data.title,
      isPublished: data.is_published,
      questionList: data.questions.map((q: any) => ({
        questionID: q.id,
        questionDescription: q.content,
        answerList: q.answer_choices.map((a: any, i: string) => ({
          answerID: i,
          answerDescription: a,
        })),
        correctAnswerID: q.answer_choices.findIndex((a: any) => (a === true)),
      })),
    }
    return convertedData;
  }

  const convertQuestionDataCtS = (data: Question) => {
    const convertedData = {
      content: data.questionDescription,
      answer_choices: data.answerList.map(a => a.answerDescription),
      right_answers: [data.answerList.find(a => a.answerID === data.correctAnswerID)?.answerDescription]
    }
    return convertedData
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
