import { useImmer } from 'use-immer';
import { QuestionInputArea } from '../question-input-area/question-input-area';
import { AnswersInputArea } from '../answers-input-area/answers-input-area';
import styles from './create-question-manager.module.scss';
import { useEffect, useState } from 'react';
import { generateAnswersAction } from '../../../api/questions';

export const CreateQuestionManager = ({
  defaultQuestionData,
  actionQuestionUpdate,
  isLastQuestion,
  actionQuestionAdd,
  actionQuestionSave,
  currentQuestionID,
  currentQuestionIndex,
  actionQuestionDelete,
}) => {
  const [currentQuestionData, setCurrentQuestionData] = useImmer(defaultQuestionData);
  const [generateAmount, setGenerateAmount] = useState(0);

  useEffect(() => {
    setCurrentQuestionData(defaultQuestionData);
  }, [defaultQuestionData]);

  const actionAnswerDelete = (answerID) => {
    setCurrentQuestionData(draft => {
      draft.answerList =
        draft.answerList.filter(answer => (answer.answerID !== answerID));
    });
  }

  const actionAnswerAdd = () => {
    setCurrentQuestionData(draft => {
      draft.answerList.push({
        answerID: Math.max(...draft.answerList.map(answer => answer.answerID)) + 1,
        answerDescription: '',
      });
    });
  }

  const handleQuestionDescriptionChange = (evt) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.questionDescription = value;
    });
  }

  const handleCorrectAnswerChange = (evt) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.correctAnswerID = +value;
    });
  }

  const handleAnswerDescriptionChange = (evt, answerID) => {
    const {value} = evt.target;
    setCurrentQuestionData(draft => {
      draft.answerList
        .find(answer => (answer.answerID === answerID))
        .answerDescription = value;
    });
  }

  const handleAnswerAdd = (evt) => {
    evt.preventDefault();
    actionAnswerAdd();
  }

  const handleQuestionDelete = async (evt) => {
    evt.preventDefault();
    await actionQuestionDelete();
  }

  const handleAnswerDelete = (evt, answerID) => {
    evt.preventDefault();
    actionAnswerDelete(answerID);
    if (currentQuestionData.answerList.length === 2) {
      actionAnswerAdd();
    }
  }

  const handleSaveClick = async (evt) => {
    evt.preventDefault();
    if (currentQuestionID <= 0) {
      await actionQuestionSave(currentQuestionData);
    } else await actionQuestionUpdate(currentQuestionData);
    if (isLastQuestion) {
      actionQuestionAdd();
    }
  }

  const handleGenerateAmountChange = (evt) => {
    let newValue = evt.target.value.replace(/\D/,'');
    newValue = Math.min(newValue, 10);
    setGenerateAmount(newValue);
  }

  const handleGenerateAnswersClick = async (evt) => {
    evt.preventDefault();
    const request = {
      content: currentQuestionData.questionDescription,
      test: 1,
      answer_set: currentQuestionData.answerList.map(a => ({content: a.answerDescription, is_true: (a.answerID === currentQuestionData.correctAnswerID)})),
      generate_count: generateAmount,
    }
    const {answer_set} = await generateAnswersAction(request);
    const response = {
      answerList: answer_set.map((a, i) => ({
        answerID: i,
        answerDescription: a.content,
      })),
      correctAnswerID: answer_set.findIndex(a => (a.is_true === true)),
    }
    console.log(response);
    setCurrentQuestionData(draft => {
      draft.answerList = response.answerList;
      draft.correctAnswerID = response.correctAnswerID;
    });
  }

  return (
    <form className={styles.questionForm} action="#" name="question-form">
      <QuestionInputArea
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={currentQuestionIndex}
        questionDescription={currentQuestionData.questionDescription}
        handleQuestionDescriptionChange={handleQuestionDescriptionChange}
      />
      <AnswersInputArea
        answerList={currentQuestionData.answerList}
        correctAnswerID={currentQuestionData.correctAnswerID}
        handleCorrectAnswerChange={handleCorrectAnswerChange}
        handleAnswerDescriptionChange={handleAnswerDescriptionChange}
        handleAnswerDelete={handleAnswerDelete}
      />
      <div className={styles.controls}>
        <button
          className={styles.plusButton}
          onClick={handleAnswerAdd}
        >+</button>
        <fieldset className={styles.generateAnswersForm}>
          <button
            className={styles.generateAnswersButton}
            onClick={handleGenerateAnswersClick}
          >Сгенерировать варианты ответов</button>
          <input
            type='number'
            min={0}
            max={10}
            id='generateAmount'
            value={generateAmount}
            onChange={handleGenerateAmountChange}
          />
        </fieldset>
        <div className={styles.questionControls}>
        <button
          onClick={handleQuestionDelete}
        >Удалить вопрос</button>
        <button
          onClick={handleSaveClick}
        >Сохранить вопрос</button>
        </div>
      </div>
    </form>
  );
}
