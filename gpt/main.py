from fastapi import FastAPI

from app.schemas import QuestionData
from app.services import generate_wrong_answer_choices

app = FastAPI()


@app.post('/api/questions/generate')
def create_answer_choices(data: QuestionData):
    """
    Example:

    {
        "count": 5,
        "content": "На каком материке находится Франция?",
        "right_answers": ["Евразия"],
        "answer_choices": ["Южная Америка", "Австралия"]
    }
    """
    return {'answer_choices': generate_wrong_answer_choices(data)}
