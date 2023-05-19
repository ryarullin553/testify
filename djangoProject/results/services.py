from django.db.models import Avg, FloatField
from django.db.models.functions import Cast
from pytz import timezone
from datetime import datetime
from .serializers import ChoicedAnswerSerializer


def get_total_data(result):
    """Возвращает результат прохождения теста"""
    choiced_answers = result.choicedanswer_set
    questions_count = result.test.question_set.count()
    total_answers = choiced_answers.count()
    correct_answers = choiced_answers.filter(answer__is_true=True).count()
    time = get_formatted_time(result)
    score = get_score(correct_answers, questions_count)

    total_data = {
        'questions_count': questions_count,
        'total_answers': total_answers,
        'correct_answers': correct_answers,
        'time': time,
        'score': score,
    }

    total_data.update(get_average_score(result))

    return total_data


def get_formatted_time(result):
    """Вычисляет время прохождения теста и приводит его в формат %H:%M:%S"""
    time = datetime.now(timezone('UTC')) - result.time_create
    dt = datetime(1900, 1, 1) + time
    formatted_time = dt.strftime('%H:%M:%S')
    return formatted_time


def get_score(correct_answers, questions_count):
    """Вычисляет процент прохождения теста"""
    try:
        score = round(correct_answers / questions_count * 100)
    except ZeroDivisionError:
        score = 0
    return score


def get_average_score(result):
    """Вычисляет средний процент прохождения теста всех пользователей"""
    test = result.test
    finished_results = test.results.exclude(total=None)
    total_scores = finished_results.annotate(total_score=Cast('total__score', output_field=FloatField()))
    average_score = total_scores.aggregate(average_score=Avg('total_score'))
    return average_score


def update_result_passage(choiced_answer):
    """Добавляет или обновляет поле с выбранным ответом в прохождении теста"""
    result = choiced_answer.result
    questions = result.passage['question_set']
    for question in questions:
        for answer in question['answer_set']:
            if answer['id'] == choiced_answer.answer.pk:
                question['choiced_answer'] = ChoicedAnswerSerializer(choiced_answer).data
    result.save()
