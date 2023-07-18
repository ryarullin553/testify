from pytz import timezone
from datetime import datetime
from tests.tasks import update_test_results_metrics


def complete_passage(instance):
    instance.result = get_result(instance)
    instance.save()
    update_test_results_metrics.delay(instance.test_id)


def get_result(passage):
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
                'score': points_score
            }
        )
    else:
        answers_score = get_score(passage.correct_answers_count, passage.questions_count)
        result['score'] = answers_score
    return result


def get_passage_time(passage):
    time = datetime.now(timezone('UTC')) - passage.created
    dt = datetime(1900, 1, 1) + time
    formatted_time = dt.strftime('%H:%M:%S')
    return formatted_time


def get_score(desired_number, original_number):
    try:
        score = round(desired_number / original_number * 100)
    except (ZeroDivisionError, TypeError):
        score = 0
    return score
