from pydantic import BaseModel, Field


class QuestionData(BaseModel):
    count: int = Field(ge=0, le=20)
    content: str
    right_answers: list[str]
    answer_choices: list[str] | None
