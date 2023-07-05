from pytz import timezone
from datetime import datetime


def get_result(passage):
    """Высчитывает результат прохождения теста"""

    result = {
        'questions_count': passage.questions_count,
        'answers_count': passage.answers_count,
        'correct_answers_count': passage.correct_answers_count,
        'passage_time': get_passage_time(passage),
        'finished_time': datetime.now().isoformat(timespec='minutes'),
    }

    if passage.test.has_points:
        total_points = passage.total_points
        user_points = passage.user_points
        points_score = get_score(user_points, total_points)
        result.update(
            {
                'total_points': total_points,
                'user_points': user_points,
                'points_score': points_score
            }
        )
    else:
        result['answers_score'] = get_score(passage.correct_answers_count, passage.questions_count)

    return result


def get_passage_time(passage):
    time = datetime.now(timezone('UTC')) - passage.created
    dt = datetime(1900, 1, 1) + time
    formatted_time = dt.strftime('%H:%M:%S')
    return formatted_time


def get_score(desired_number, original_number):
    try:
        score = round(desired_number / original_number * 100)
    except ZeroDivisionError:
        score = 0
    return score

# def get_average_score(result):
#     """Вычисляет средний процент прохождения теста всех пользователей"""
#     test = result.test
#     finished_results = test.results.exclude(total=None)
#     total_scores = finished_results.annotate(total_score=Cast('total__score', output_field=FloatField()))
#     average_score = total_scores.aggregate(average_score=Avg('total_score'))
#     return average_score
#
