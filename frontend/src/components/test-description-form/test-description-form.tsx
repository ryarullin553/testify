'use client'

import { FC, useEffect, useState, ChangeEvent, FormEvent } from 'react'
import styles from './test-description-form.module.scss'
import { AppRoute } from '../../reusable/const'
import { createTestAction, editTestAction, fetchTestDescriptionAction } from '../../api/tests'
import { Test } from '../../types/Test'
import { useRouter } from 'next/navigation'
import { useCreateTestMutation, useUpdateTestSettingsByIDMutation } from '@/services/testsApi'

interface Props {
  testData?: Test
}

interface FormState {
  testTitle: string
  testSummary: string
  testDescription: string
  testAvatar: File | null
}

export const TestDescriptionForm: FC<Props> = ({ testData }) => {
  const router = useRouter()
  const isNewTest = Boolean(!testData)
  const [createTest, { isSuccess }] = useCreateTestMutation()
  const [updateTest, _] = useUpdateTestSettingsByIDMutation()
  const { testTitle, testSummary, testDescription, testID } = testData || {
    testTitle: '',
    testSummary: '',
    testDescription: '',
  }
  const initialFormState: FormState = {
    testTitle,
    testSummary,
    testDescription,
    testAvatar: null,
  }
  let [formData, setFormData] = useState<FormState>(initialFormState)

  const handleOnFormChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    let { name, value } = evt.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAvatarUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    let { files } = evt.target
    // разобраться
    setFormData({ ...formData, testAvatar: files ? files[0] : null })
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (isNewTest) {
      const newID = await createTest(formData).unwrap()
      if (isSuccess) {
        router.push(`${AppRoute.EditTest}${newID}`)
      }
    } else {
      const updateTestProps = { ...formData, testID: testID! }
      await updateTest(updateTestProps)
    }
  }

  const pageTitle = isNewTest ? 'Создать новый тест' : 'Редактировать описание теста'
  const buttonLabel = isNewTest ? 'Создать тест' : 'Сохранить'

  return (
    <form className={styles.contentForm} action='#' name='create-test-form' onSubmit={handleSubmit}>
      <h1 className={styles.createTest}>{pageTitle}</h1>
      <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
        <label>Название</label>
        <textarea
          id='testTitle'
          name='testTitle'
          value={formData.testTitle}
          placeholder='Название теста'
          onChange={handleOnFormChange}
        />
        <p>Не более 64 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
        <label>Краткое описание</label>
        <textarea
          id='testSummary'
          name='testSummary'
          value={formData.testSummary}
          placeholder='Видно в поиске и на промостранице сразу после названия курса'
          onChange={handleOnFormChange}
        />
        <p>Для публикации нужно не менее 100 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.abstractForm}`}>
        <label>Полное описание</label>
        <textarea
          id='testDescription'
          name='testDescription'
          value={formData.testDescription}
          placeholder='Все, что важно знать до начала прохождения теста. Расскажите о:
            • цели теста,
            • почему стоит его пройти,
            • какие у него особенности,
            • какие будут вопросы,
            • что можно получить после его прохождения.'
          onChange={handleOnFormChange}
        />
      </fieldset>
      <fieldset className={styles.testLogo}>
        <label>Логотип</label>
        <div className={`${styles.dropZone} ${formData.testAvatar && styles.active}`}>
          <p>png-файл с прозрачностью 230х230px</p>
          <input type='file' id='testAvatar' name='testAvatar' accept='image/png' onChange={handleAvatarUpload} />
        </div>
      </fieldset>
      <div className={styles.controls}>
        <button type={'submit'} className={styles.createButton}>
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
