'use client'

import { FC, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import styles from './test-description-form.module.scss';
import { AppRoute } from '../../reusable/const';
import { createTestAction, editTestAction, fetchTestDescriptionAction } from '../../api/tests';
import { Test } from '../../types/Test';
import { useRouter } from 'next/navigation';

interface Props {
  testID: Test['testID'],
}

interface FormData {
  title: string,
  shortAbstract: string,
  abstract: string,
  avatar: File | null,
}

export const TestDescriptionForm: FC<Props> = ({ testID }) => {
  const router = useRouter();
  let [formData, setFormData] = useState<FormData>({
    title: '',
    shortAbstract: '',
    abstract: '',
    avatar: null,
  });

  const handleOnFormChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    let {name, value} = evt.target;
      setFormData({...formData, [name]: value});
  }

  const handleAvatarUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    let {files} = evt.target;
    // разобраться
    setFormData({...formData, avatar: (files ? files[0] : null)});
  }

  const handleSubmit = async (evt: FormEvent<HTMLButtonElement>) => {
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
      router.push(`${AppRoute.EditTest}/${newTestID}`);
    } catch (err) {
      return;
    }
  }

  const convertTestDataCtS = (data: any) => {
    const modifiedData = {
      title: data.title,
      short_description: data.shortAbstract,
      description: data.abstract,
      avatar: data.avatar,
    }
    return modifiedData;
  }

  const convertTestDataStC = (data: any) => {
    const modifiedData: FormData = {
      title: data.title,
      shortAbstract: data.description,
      abstract: data.full_description,
      avatar: null,
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
