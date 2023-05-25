from djangoProject.settings import OPENAI_API_KEY
import openai


def get_wrong_answers(data):
    question = data.get('content')
    answers_data = data.get('answer_set', [])
    generate_count = data.pop('generate_count', 0)
    right_answer = [answer['content'] for answer in answers_data if answer['is_true']][0]

    openai.api_key = OPENAI_API_KEY
    prompt = f"Сгенерируй {generate_count} неправильных варианта ответа на данный вопрос: {question}, " \
             f"учитывая, что правильный ответ: {right_answer}"
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    wrong_answers = completion.choices[0].message.content.split('\n')
    return wrong_answers
