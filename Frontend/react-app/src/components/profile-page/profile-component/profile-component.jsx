import styles from './profile-component.module.scss';

export const ProfileComponent = () => {

    return (
        <>
            <section className={styles.tests}>
                <section className={styles.info}>
                    <div className={styles.container}>
                        <div className={styles.logo}>
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.name}>Имя Фамилия</h3>
                            <p className={styles.about}>О себе</p>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}