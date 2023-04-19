import styles from './profile-navigation.module.scss';

export const ProfileNavigation = () => {
  return (
    <section className={styles.profileNavigation}>
      <ol>
        <li>
          <a href="#">Профиль</a>
        </li>
        <li>
          <a href="#">Тесты</a>
        </li>
        <li>
          <a href="#">Мои тесты</a>
        </li>
        <li>
          <a href="#">Избранное</a>
        </li>
        <li>
          <a href="#">Настройки</a>
        </li>
      </ol>
    </section>
  );
}

