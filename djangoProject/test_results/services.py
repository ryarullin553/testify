from tests.models import Question, Answer
from tests.serializers import QuestionSerializer
from .models import Result
from .serializers import ChoicedAnswerSerializer


def get_result_data(result):
    """Возвращает словарь с результатами теста"""
    test = result.test
    questions = Question.objects.filter(test=test)
    choiced_answers = result.choicedanswer_set
    questions_data = get_questions_data(questions, choiced_answers)

    total_answers = choiced_answers.count()
    correct_answers = choiced_answers.filter(answer__is_true=True).count()
    questions_count = test.question_set.count()

    try:
        score = round(correct_answers / questions_count * 100)
    except ZeroDivisionError:
        score = 0

    result_data = {
        'result_id': result.pk,
        'test_title': test.title,
        'questions_count': questions_count,
        'total_answers': total_answers,
        'correct_answers': correct_answers,
        'score': score,
        'is_finished': result.is_finished,
        'questions': questions_data,
    }

    return result_data


def get_questions_data(questions, all_choiced_answers):
    """Возвращает данные вопроса с выбранными вариантами ответов"""
    questions_data = []
    for question in questions:
        choiced_answers = all_choiced_answers.filter(answer__question=question)
        choiced_answers_serializer = ChoicedAnswerSerializer(choiced_answers, many=True)
        question_data = QuestionSerializer(question).data
        question_data['choiced_answers'] = choiced_answers_serializer.data
        questions_data.append(question_data)
    return questions_data


def answer_is_exist(self, answer_pk: str, result_pk: str) -> bool:
    """Проверяет наличие ответа в результате"""
    answer = self.get_model_object(Answer, answer_pk)
    result = self.get_model_object(Result, result_pk)
    test = answer.question.test
    result_test = result.test
    return test == result_test


def choiced_answer_is_exist(self, answer_pk: str, result_pk: str) -> bool:
    """Проверяет наличие выбранного ответа в результате"""
    answer = self.get_model_object(Answer, answer_pk)
    result = self.get_model_object(Result, result_pk)
    choiced_answers = answer.choicedanswer_set.all()
    return any(choiced_answer for choiced_answer in choiced_answers if choiced_answer.result == result)
