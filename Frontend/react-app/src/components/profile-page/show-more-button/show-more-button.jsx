import styles from './show-more-button.module.scss';

export const ShowMoreButton = () => {
    return <>
    <div className={styles.controls}>
                        <button className={styles.button}>Показать все</button>
                    </div>
    </>
}