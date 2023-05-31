import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './test-description-form.module.scss';
import { AppRoute } from '../../const';
import { createTestAction, editTestAction, fetchTestDescriptionAction } from '../../api/tests';

export const TestDescriptionForm = ({testID}) => {
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

  const handleAvatarUpload = (evt) => {
    let {files} = evt.target;
    setFormData({...formData, avatar: files[0]});
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let config;
    const convertedFormData = convertTestDataCtS(formData);
    if (formData.avatar) {
      config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
    }
    if (testID) {
      await editTestAction(testID, convertedFormData, config);
    } else try {
      const newTestID = await createTestAction(convertedFormData, config);
      navigate(`${AppRoute.EditTest}/${newTestID}`);
    } catch (err) {
      return;
    }
  }

  const convertTestDataCtS = (data) => {
    const modifiedData = {
      title: data.title,
      description: data.shortAbstract,
      full_description: data.abstract,
      avatar: data.avatar,
    }
    return modifiedData;
  }

  const convertTestDataStC = (data) => {
    const modifiedData = {
      title: data.title,
      shortAbstract: data.description,
      abstract: data.full_description,
    }
    return modifiedData;
  }

  const fetchTestData = async () => {
    const data = await fetchTestDescriptionAction(testID);
    const convertedData = convertTestDataStC(data);
    setFormData(convertedData);
  }

  const pageTitle = testID ? 'Редактировать описание теста' : 'Создать новый тест';
  const buttonLabel = testID ? 'Сохранить' : 'Создать тест';

  useEffect(() => {
    if (testID) fetchTestData();
  }, []);

  return (
    <form className={styles.contentForm} action="#" name="create-test-form">
      <h1 className={styles.createTest}>{pageTitle}</h1>
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
          className={`${styles.dropZone} ${formData.avatar && styles.active}`}
        >
        <p>png-файл с прозрачностью 230х230px</p>
        <input
          type='file'
          id='avatar'
          name='avatar'
          accept="image/png"
          onChange={handleAvatarUpload}
        />
        </div>
      </fieldset>
      <div className={styles.controls}>
        <button className={styles.createButton} onClick={handleSubmit}>{buttonLabel}</button>
      </div>
    </form>
  );
}
