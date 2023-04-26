from test_results.models import Result
from tests.models import Answer


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

