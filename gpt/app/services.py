from g4f import ChatCompletion, Provider


def generate_wrong_answer_choices(data):
    prompt = f"Сгенерируй {data.count} неправильных вариантов ответа на данный вопрос: {data.content}, " \
             f"учитывая, что правильными ответами являются: {data.right_answers}. " \
             f"Не добавляй уже написанные неправильные ответы из этого списка: {data.answer_choices}." \
             f"Без точки в конце"
    response = ChatCompletion.create(
        model='gpt-3.5-turbo',
        provider=Provider.DeepAi,
        messages=[{"role": "system", "content": prompt}]
    )
    generated_wrong_answer_choices = [answer_choice[3:].strip() for answer_choice in response.split('\n')]
    return generated_wrong_answer_choices
