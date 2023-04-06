import './create-question-page.css';

export const CreateQuestionContent = () => {
  return (
    <main className="page-main">
      <section className="question-list-section">
        <h2>Название теста</h2>
        <ol>
          <li>
            <a href="#">Текст вопроса</a>
          </li>
          <li>
            <a href="#">Текст вопросааааааааааа</a>
          </li>
        </ol>
        <button>Опубликовать тест</button>
      </section>
      <form className="question-form" action="#" name="temp-name">
        <fieldset className="question-area">
          <label>Вопрос</label>
          <textarea
            name=""
            id=""
            placeholder="Напишите ваш вопрос или условие задачи"
            defaultValue={""}
          />
        </fieldset>
        <fieldset className="answers-area">
          <legend>Ответы</legend>
          <p>Добавьте варианты ответа и отметьте правильный</p>
          <ul>
            <li>
              <label htmlFor="1-answer">
                <input type="radio" id="1-answer" name="temp-name" />
                <input type="text" placeholder="Первый ответ" />
              </label>
            </li>
            <li>
              <label htmlFor="2-answer">
                <input type="radio" id="2-answer" name="temp-name" />
                <input type="text" placeholder="Второй ответ" />
              </label>
            </li>
            <li>
              <label htmlFor="3-answer">
                <input type="radio" id="3-answer" name="temp-name" />
                <input type="text" placeholder="Третий ответ" />
              </label>
            </li>
            <li>
              <label htmlFor="4-answer">
                <input type="radio" id="4-answer" name="temp-name" />
                <input type="text" placeholder="Четвертый ответ" />
              </label>
            </li>
          </ul>
        </fieldset>
        <div className="controls">
          <button className="plus-button">+</button>
          <button className="save-button">Сохранить вопрос</button>
        </div>
      </form>
    </main>
  )
};
