from fastapi import FastAPI

from app.schemas import QuestionData
from app.services import generate_wrong_answer_choices

app = FastAPI(
    title='Testify',
    version='0.2.0'
)


@app.post('/create_answer_choices')
async def create_answer_choices(data: QuestionData):
    """
    Example:

    {
        "count": 5,
        "content": "На каком материке находится Франция?",
        "right_answers": ["Евразия"],
        "answer_choices": ["Южная Америка", "Австралия"]
    }
    """
    answer_choices = await generate_wrong_answer_choices(data)
    return {'answer_choices': answer_choices}
