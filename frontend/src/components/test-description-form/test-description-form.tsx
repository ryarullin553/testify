'use client'

import { FC, useEffect, useState, ChangeEvent, FormEvent } from 'react'
import styles from './test-description-form.module.scss'
import { AppRoute } from '../../reusable/const'
import { createTestAction, editTestAction, fetchTestDescriptionAction } from '../../api/tests'
import { Test } from '../../types/Test'
import { useRouter } from 'next/navigation'
import { useCreateTestMutation, useUpdateTestSettingsByIDMutation } from '@/services/testCreationApi'

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

  let [isSelected, setSelected] = useState(false)

  const handleSwitchButton = () => {
    return isSelected ? styles.switchButton : styles.switchButtonFalse
  }

  const handleSwitchToggle = () => {
    return isSelected ? styles.switchToggle : styles.switchToggleFalse
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
    <form className={styles.contentForm} action='#' name='create-test-form'>
      <div className={styles.wrapper}>
        <h1 className={styles.createTest}>{pageTitle}</h1>
        <button className={styles.publishButton}></button>
      </div>
      <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
        <label>
          Название <span>*</span>
        </label>
        <textarea id='title' name='title' defaultValue={testTitle} placeholder='Название теста' />
        <p>Не более 64 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
        <label>
          Краткое описание <span color='red'>*</span>
        </label>
        <textarea
          id='testSummary'
          name='testSummary'
          defaultValue={formData.testSummary}
          placeholder='Видно в поиске и на промостранице сразу после названия курса'
        />
        <p>Для публикации нужно не менее 100 символов</p>
      </fieldset>
      <fieldset className={`${styles.contentArea} ${styles.abstractForm}`}>
        <label>Полное описание</label>
        <textarea
          id='testDescription'
          name='testDescription'
          defaultValue={formData.testDescription}
          placeholder='Все, что важно знать до начала прохождения теста. Расскажите о:
            • цели теста,
            • почему стоит его пройти,
            • какие у него особенности,
            • какие будут вопросы,
            • что можно получить после его прохождения.'
        />
      </fieldset>
      <div className={styles.testOptionsLogo}>
        <fieldset className={styles.testLogo}>
          <label>Логотип</label>
          <div className={`${styles.dropZone} ${formData.testAvatar && styles.active}`}>
            <p>png-файл с прозрачностью 230х230px</p>
            <input type='file' id='avatar' name='avatar' accept='image/png' />
          </div>
        </fieldset>

        <div className={styles.testOptions}>
          <div className={`${styles.points} ${styles.option}`}>
            <div onClick={() => setSelected(!isSelected)} className={`${styles.switch} ${handleSwitchButton()}`}>
              <span className={`${styles.toggle} ${handleSwitchToggle()}`}></span>
            </div>

            <label>Баллы</label>

            <div className={styles.tooltip}>
              <span className={styles.tooltipText}>Добавить баллы к вопросам</span>
            </div>
          </div>
          <div className={`${styles.comment} ${styles.option}`}>
            <div onClick={() => setSelected(!isSelected)} className={`${styles.switch} ${handleSwitchButton()}`}>
              <span className={`${styles.toggle} ${handleSwitchToggle()}`}></span>
            </div>
            <label>Комментарии</label>

            <div className={styles.tooltip}>
              <span className={styles.tooltipText}>Открыть комментарии к вопросам</span>
            </div>
          </div>
          <div className={`${styles.rightAnswers} ${styles.option}`}>
            <div onClick={() => setSelected(!isSelected)} className={`${styles.switch} ${handleSwitchButton()}`}>
              <span className={`${styles.toggle} ${handleSwitchToggle()}`}></span>
            </div>
            <label>Правильные ответы</label>

            <div className={styles.tooltip}>
              <span className={styles.tooltipText}>Показать правильные ответы</span>
            </div>
          </div>
          <div className={`${styles.explanations} ${styles.option}`}>
            <div onClick={() => setSelected(!isSelected)} className={`${styles.switch} ${handleSwitchButton()}`}>
              <span className={`${styles.toggle} ${handleSwitchToggle()}`}></span>
            </div>
            <label>Пояснения к вопросам</label>

            <div className={styles.tooltip}>
              <span className={styles.tooltipText}>Показывать пояснения к вопросам</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <button type={'submit'} className={styles.createButton}>
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
