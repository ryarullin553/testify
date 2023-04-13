export const newTestData = {
  testID: 1,
  testTitle: 'Мой первый тест',
  questionList: [
    {
      questionID: 1,
      questionDescription: 'Вопрос один',
      answerList: [
        { answerID: 1, answerDescription: 'Первый ответ' },
        { answerID: 2, answerDescription: 'Второй ответ' },
        { answerID: 3, answerDescription: 'Третий ответ' },
      ],
      correctAnswerID: 2,
    }, 
    {
      questionID: 2,
      questionDescription: 'Вопрос два',
      answerList: [
        { answerID: 1, answerDescription: 'Первый ответ' },
        { answerID: 2, answerDescription: 'Второй ответ' },
      ],
      correctAnswerID: 1,
    },
  ]
};
