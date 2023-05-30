import { useParams } from 'react-router';
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar';
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button';
import { QuestionArea } from '../test-content/question-area/question-area';
import styles from './results-content.module.scss';
import { useEffect, useState } from 'react';
import { fetchAttemptAction } from '../../api/results';
import { QUESTION_STATES } from '../test-content/test-content';
import { ResultsArea } from './results-area/results-area';
import { CommentBlock } from '../comment-block/comment-block';
import { ReviewsBlock } from '../reviews-block/reviews-block';

export const ResultsContent = () => {
  const { attemptID } = useParams();
  const [results, setResults] = useState();
  const [currentQuestionID, setCurrentQuestionID] = useState();

  useEffect(() => {
    getResults(attemptID);
  }, []);

  const getResults = async () => {
    const data = await fetchAttemptAction(attemptID);
    const convertedData = convertDataStC(data);
    setResults(convertedData);
    setCurrentQuestionID(-1);
  }

  const getCurrentQuestionData = (state, currentQuestionID) => state.questionList
    .find(question => (question.questionID === currentQuestionID));

  const getCurrentQuestionIndex = (state, currentQuestionID) => state.questionList
    .findIndex(question => (question.questionID === currentQuestionID));

  const convertDataStC = (data) => {
    const convertedData = {
      testID: data.test,
      testTitle: data.passage.title,
      attemptID: data.id,
      questionList: data.passage.question_set.map(q => ({
        questionID: q.id,
        questionDescription: q.content,
        questionState: !q.choiced_answer
          ? QUESTION_STATES.NoAnswer
          : (q.choiced_answer.answer === q.answer_set.find(a => a.is_true).id)
            ? QUESTION_STATES.Correct
            : QUESTION_STATES.Incorrect,
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
      answersCorrect: data.total.correct_answers,
      questionsAmount: data.total.questions_count,
      score: data.total.score,
      time: data.total.time,
      answersTotal: data.total.total_answers,
    }
    return convertedData;
  }

  if (!results) return <></>;

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={results.testTitle}
        questionList={results.questionList}
        setCurrentQuestionID={setCurrentQuestionID}
        isTogglable={false}
      >
        <QuestionListSidebarButton
          label={'К результатам'}
          onClickAction={() => setCurrentQuestionID(-1)}
          condition
        />
      </QuestionListSidebar>
      {(currentQuestionID === -1)
      ? <div>
          <ResultsArea
            results={results}
          />
          <ReviewsBlock testID={results.testID}/>
        </div>
      : <QuestionArea
        questionData={getCurrentQuestionData(results, currentQuestionID)}
        questionIndex={getCurrentQuestionIndex(results, currentQuestionID)}
      />}
    </main>
  );
}
