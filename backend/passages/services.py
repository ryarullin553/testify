from django.db.models import Avg, FloatField, Sum
from django.db.models.functions import Cast
from pytz import timezone
from datetime import datetime


def get_result(passage):
    """Возвращает результат прохождения теста"""
    test = passage.test
    answers = passage.answers
    questions = test.questions

    questions_count = questions.count()
    answers_count = answers.count()
    correct_answers_count = get_correct_answers_count(answers)
    passage_time = get_passage_time(passage)

    total_data = {
        'questions_count': questions_count,
        'answers_count': answers_count,
        'correct_answers_count': correct_answers_count,
        'passage_time': passage_time,
        'finished_time': datetime.now().isoformat(),
    }

    if test.has_points:
        total_data.update(get_total_points(questions))
        total_data.update(get_user_points(answers))

    return total_data


def get_correct_answers_count(answers):
    correct_answers_count = 0
    for answer in answers:
        if answer.content == answer.question.right_answers:
            correct_answers_count += 1
    return correct_answers_count


def get_passage_time(passage):
    return datetime.now(timezone('UTC')) - passage.created


def get_total_points(questions):
    return questions.aggregate(total_points=Sum('points'))


def get_user_points(answers):
    user_points = 0
    for answer in answers:
        if answer.content == answer.question.right_answers:
            user_points += answer.question.points
    return {'user_points': user_points}


def get_score(correct_answers_count, questions_count):
    """Вычисляет процент прохождения теста"""
    try:
        score = round(correct_answers_count / questions_count * 100)
    except ZeroDivisionError:
        score = 0
    return score

# def get_total_data(result):
#     """Возвращает результат прохождения теста"""
#     choiced_answers = result.choicedanswer_set
#     questions_count = result.test.question_set.count()
#     total_answers = choiced_answers.count()
#     correct_answers = choiced_answers.filter(answer__is_true=True).count()
#     time = get_formatted_time(result)
#     score = get_score(correct_answers, questions_count)
#
#     total_data = {
#         'questions_count': questions_count,
#         'total_answers': total_answers,
#         'correct_answers': correct_answers,
#         'time': time,
#         'score': score,
#         'finished': datetime.now().isoformat(),
#     }
#
#     total_data.update(get_average_score(result))
#
#     return total_data
#
# def get_passage_time(passage):
#     """Вычисляет время прохождения теста и приводит его в формат %H:%M:%S"""
#     time = datetime.now(timezone('UTC')) - passage.created
#     dt = datetime(1900, 1, 1) + time
#     formatted_time = dt.strftime('%H:%M:%S')
#     return formatted_time
#
#
# def get_score(correct_answers, questions_count):
#     """Вычисляет процент прохождения теста"""
#     try:
#         score = round(correct_answers / questions_count * 100)
#     except ZeroDivisionError:
#         score = 0
#     return score
#
#
# def get_average_score(result):
#     """Вычисляет средний процент прохождения теста всех пользователей"""
#     test = result.test
#     finished_results = test.results.exclude(total=None)
#     total_scores = finished_results.annotate(total_score=Cast('total__score', output_field=FloatField()))
#     average_score = total_scores.aggregate(average_score=Avg('total_score'))
#     return average_score
#
