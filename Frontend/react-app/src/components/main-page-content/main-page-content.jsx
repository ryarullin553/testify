import { ContrastButton } from '../contrast-button/contrast-button'
import { PaleButton } from '../pale-button/pale-button'
import styles from './main-page-content.module.scss'

export const MainPageContent = () => {
  return (
    <main className={styles.pageMain}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>
            Testify — бесплатная платформа для создания и прохождения тестов
          </h1>
          <p>Попробуйте воспользоваться нашим онлайн-конструктором</p>
          <ContrastButton type={'link'} label={'Создать тест'}/>
          <ContrastButton type={'link'} label={'Найти тест'} inversed/>
        </div>
      </section>
      <section className={styles.advantagesSection}>
        <div className={styles.advantagesTextBlock}>
          <h2>Почему выбирают Testify?</h2>
          <p>
            В настоящий момент на нашей платформе зарегистрировано 137 980
            пользователей
          </p>
        </div>
        <div className={styles.advantagesCard}>
          <p>Большой ассортимент тестов</p>
        </div>
        <div className={styles.advantagesCard}>
          <p>Отсутствие ограничений при создании</p>
        </div>
        <div className={styles.advantagesCard}>
          <p>Удобный интерфейс</p>
        </div>
      </section>
      <section className={styles.userProfileSection}>
        <div className={styles.userProfileBlock}>
          <div className={styles.userProfileBlockContent}>
            <h2>
              Отслеживайте свои результаты тестов в <span>личном кабинете</span>
            </h2>
            <p>
              Вам доступен список пройденных тестов с результатами, а также все
              взаимодействия с ними
            </p>
            <ContrastButton type={'link'} label={'Войти'}/>
          </div>
        </div>
        <div className={styles.userProfileBlock}>
          <div className={styles.userProfileBlockContent}>
            <h2>
              Изучайте <span>статистику</span> ваших тестов
            </h2>
            <p>
              В личном кабинете в разделе “Мои тесты” вам доступны статистические
              данные по вашим авторским тестам
            </p>
            <ContrastButton type={'link'} label={'Войти'}/>
          </div>
        </div>
      </section>
      <section className={styles.contactUsSection}>
        <div className={styles.contactUsContent}>
          <h2>Есть вопросы или предложения?</h2>
          <form className={styles.contactUsForm} action="#">
            <textarea
              name="contact-us"
              id="contact-us-textarea"
              placeholder="Напишите нам"
              defaultValue=""
            />
            <PaleButton label={'Отправить'}/>
          </form>
          <a className={styles.mailLink} href="mailto:testify.project.info@gmail.com">
            testify.project.info@gmail.com
          </a>
        </div>
      </section>
    </main>
  )
}