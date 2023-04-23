from .serializers import ChoicedAnswerSerializer
from tests.models import Question
from tests.serializers import AnswerSerializer, QuestionSerializer


def get_result_data(result):
    """Возвращает словарь с результатами теста"""
    test = result.test
    questions = Question.objects.filter(test=test)
    choiced_answers = result.choicedanswer_set
    questions_data = get_questions_data(questions, choiced_answers)

    total_answers = choiced_answers.count()
    correct_answers = choiced_answers.filter(answer__is_true=True).count()
    questions_count = test.question_set.count()

    result_data = {
        'result_id': result.pk,
        'test_title': test.title,
        'questions_count': questions_count,
        'total_answers': total_answers,
        'correct_answers': correct_answers,
        'score': round(correct_answers / questions_count * 100),
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
