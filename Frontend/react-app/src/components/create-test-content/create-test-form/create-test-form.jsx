import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './create-test-form.module.scss';
import { api } from '../../../store';
import { AppRoute } from '../../../consts/const.js';

export const CreateTestForm = () => {
  const navigate = useNavigate();
  let [formData, setFormData] = useState({
    title: '',
    shortAbstract: '',
    abstract: '',
  });

  const handleOnFormChange = (evt) => {
    let {name, value} = evt.target;
    setFormData({...formData, [name]: value});
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      let {pk} = await api.post('/tests/', {
        title: formData.title,
        description: formData.shortAbstract,
        full_description: formData.abstract,
      });
      navigate(`${AppRoute.EditTest}/${pk}`);
    } catch (err) {
      return;
    }
  }

  return (
    <form className={styles.contentForm} action="#" name="create-test-form">
      <h1 className={styles.createTest}>Создание нового теста</h1>
      <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
        <label>Название</label>
        <textarea 
          id='title'
          name='title'
          value={formData.title}
          placeholder='Название теста'
          onChange={handleOnFormChange}
        />
        <p>Не более 64 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
        <label>Краткое описание</label>
        <textarea
          id='shortAbstract'
          name='shortAbstract'
          value={formData.shortAbstract}
          placeholder="Видно в поиске и на промостранице сразу после названия курса"
          onChange={handleOnFormChange}
        />
        <p>Для публикации нужно не менее 100 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.abstractForm}`}>
        <label>Полное описание</label>
        <textarea
          id='abstract'
          name='abstract'
          value={formData.abstract}
          placeholder="Все, что важно знать до начала прохождения теста. Расскажите о:
            • цели теста,
            • почему стоит его пройти,
            • какие у него особенности,
            • какие будут вопросы,
            • что можно получить после его прохождения."
          onChange={handleOnFormChange}
        />
      </fieldset>
      <fieldset className={styles.testLogo}>
        <label>Логотип</label>
        <div
          className={styles.dropZone}
        >
        <p>png-файл с прозрачностью 230х230px</p>
        <input
          type='file'
          id='avatar'
          name='avatar'
          accept="image/png, image/jpeg"
        />
        </div>
      </fieldset>
      <div className={styles.controls}>
        <button className={styles.createButton} onClick={handleSubmit}>Создать тест</button>
      </div>
    </form>
  );
}