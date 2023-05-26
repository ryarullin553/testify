from djangoProject.settings import OPENAI_API_KEY
import openai


def get_wrong_answers(data):
    generate_count = data.get('generate_count', 0)
    question = data.get('question')
    right_answer = data.get('right_answer')
    user_answers = data.get('wrong_answers')

    openai.api_key = OPENAI_API_KEY
    prompt = f"Сгенерируй {generate_count} неправильных вариантов ответа на данный вопрос: {question}, " \
             f"учитывая, что правильный ответ: {right_answer}. " \
             f"Не добавляй уже написанные неправильные ответы из этого списка: {user_answers}. Без точки на конце"
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    wrong_answers = [wrong_answer[3:].strip() for wrong_answer in completion.choices[0].message.content.split('\n')]
    return wrong_answers
