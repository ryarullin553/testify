import styles from './passed-test-component.module.scss'

export const PassedTestComponent = () => {
    return (
        <>
                <section className={styles.tests}>
                    <section className={styles.test}>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <div className={styles.img}></div>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.testName}>Название теста</h3>
                                <div className={styles.testAbout}>
                                    <a href="" className={styles.description}>
                                        Описание
                                    </a>
                                    <a href="" className={styles.results}>
                                        Результаты
                                    </a>
                                </div>
                            </div>
                            <svg id="Flat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path d="M144,192a16,16,0,1,1-16-16A16.01833,16.01833,0,0,1,144,192ZM128,80a16,16,0,1,0-16-16A16.01833,16.01833,0,0,0,128,80Zm0,32a16,16,0,1,0,16,16A16.01833,16.01833,0,0,0,128,112Z" />
                            </svg>
                        </div>
                    </section>
                </section>
        </>
    )
}