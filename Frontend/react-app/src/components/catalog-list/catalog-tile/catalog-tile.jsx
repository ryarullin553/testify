import { Link } from 'react-router-dom';
import styles from './catalog-tile.module.scss';
import { AppRoute } from '../../../const';

export const CatalogTile = ({id, title, avatar, shortAbstract}) => {
  return (
    <li className={styles.card}>
      <div className={styles.card__image}>
        <a href="#" className={styles.card__link}>
          <img src={avatar} alt="Изображение теста" />
        </a>
      </div>
      <div className={styles.card__info}>
        <Link to={`${AppRoute.TestMain}/${id}`} className={styles.card__link}>
          <h3 className={styles.card__title}>{title}</h3>
          <p className={styles.card__description}>{shortAbstract}</p>
          {/* <div className={styles.card__stats}>
            <div className={styles.card__feedback}>
              <div className={styles.card__feedback__stars}>
                <img
                  src="img/star_icon_active.svg"
                  className="star"
                  alt="Звезда"
                />
                <img
                  src="img/star_icon_active.svg"
                  className="star"
                  alt="Звезда"
                />
                <img
                  src="img/star_icon_active.svg"
                  className="star"
                  alt="Звезда"
                />
                <img
                  src="img/star_icon_active.svg"
                  className="star"
                  alt="Звезда"
                />
                <img
                  src="img/star_icon.svg"
                  className="star"
                  alt="Звезда"
                />
              </div>
              <span className={styles.card__feedback__value}>4.2 (147)</span>
            </div>
            <div className={styles.card__users}>
              <img src="img/user_icon.svg" alt="Пользователи" />
              <span className={styles.card__users__count}>386</span>
            </div>
          </div> */}
        </Link>
      </div>
      <button className={styles.bookmark__button}>
        <svg
          width={20}
          height={18}
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.bookmark__icon}
        >
          <path
            className="bookmark__icon-path"
            d="M12.1112 0.477675C13.153 0.0415945 14.2967 -0.0721021 15.4009 0.150654C16.5051 0.37341 17.5213 0.922842 18.3237 1.73096C18.8556 2.26513 19.2781 2.90257 19.5665 3.60597C19.8549 4.30937 20.0035 5.06461 20.0035 5.82752C20.0035 6.59042 19.8549 7.34567 19.5665 8.04907C19.2781 8.75247 18.8556 9.3899 18.3237 9.92407L10.6588 17.6832C10.4833 17.8607 10.2466 17.9602 10 17.9602C9.75339 17.9602 9.51672 17.8607 9.34125 17.6832L1.675 9.92535C1.14502 9.38999 0.724063 8.75223 0.436536 8.04903C0.14901 7.34582 0.000630561 6.59117 0 5.8288C0.00046515 5.06621 0.148764 4.31131 0.436295 3.60787C0.723827 2.90444 1.14487 2.26647 1.675 1.73096C2.74944 0.645517 4.19828 0.0374561 5.7075 0.0385758C7.2175 0.0385758 8.66875 0.646658 9.74 1.73096L10 1.9934L10.26 1.73096C10.7908 1.19342 11.4193 0.767634 12.11 0.477675H12.1112Z"
            fill="#ABABAB"
          />
          <path
            className="bookmark__icon-fill"
            d="M17.0062 3.09563C16.2812 2.36893 15.307 1.96199 14.2925 1.96199C13.278 1.96199 12.3038 2.36893 11.5787 3.09563L10.6588 4.02631C10.4833 4.20378 10.2466 4.30329 10 4.30329C9.75339 4.30329 9.51672 4.20378 9.34125 4.02631L8.42125 3.09691C7.6983 2.36715 6.72384 1.95829 5.70875 1.95883C4.6875 1.95883 3.71125 2.36849 2.99375 3.09691C2.6401 3.45358 2.35911 3.87861 2.16707 4.34734C1.97502 4.81608 1.87575 5.31919 1.875 5.82752C1.87558 6.33606 1.97478 6.83941 2.16682 7.30838C2.35887 7.77734 2.63995 8.20258 2.99375 8.5594L10 15.6516L17.0062 8.5594C17.3612 8.19968 17.6437 7.77338 17.835 7.30484C18.1252 6.59907 18.2013 5.82021 18.0535 5.06953C17.9057 4.31885 17.5408 3.63108 17.0062 3.09563Z"
            fill="#FFFFFF"
          />
        </svg>
      </button>
    </li>
  );
}