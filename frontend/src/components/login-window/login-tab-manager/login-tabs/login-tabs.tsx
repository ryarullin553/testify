import { SelectLine } from './select-line/select-line';
import styles from './login-tabs.module.scss';
import React, { FC, PropsWithChildren, SetStateAction, Dispatch } from 'react';
import { FORM_TABS } from '../../login-window';

interface Props extends PropsWithChildren {
  formTab: FORM_TABS,
  setFormTab: Dispatch<SetStateAction<FORM_TABS>>,
}

export const LoginTabs: FC<Props> = ({ formTab, setFormTab, children }) => {
  return (
    <>
      <header className={styles.tabs}>
        <button
          className={(formTab === FORM_TABS.SIGN_IN) ? styles.active : ''}
          onClick={() => setFormTab(FORM_TABS.SIGN_IN)}
        >Вход</button>
        <button
          className={(formTab === FORM_TABS.SIGN_UP) ? styles.active : ''}
          onClick={() => setFormTab(FORM_TABS.SIGN_UP)}
        >Регистрация</button>
        <SelectLine formTab={formTab}/>
      </header>
      <div className={styles.additionalContent}>
      {
        (formTab === FORM_TABS.RESET)
        &&
        <><h2>Забыли свой пароль?</h2>
        <p>Вам на почту будет отправлена ссылка для сброса пароля.</p></>
      }
      {children}
      {
        (formTab === FORM_TABS.SIGN_IN)
        &&
        <button
          className={styles.resetButton}
          onClick={() => setFormTab(FORM_TABS.RESET)}
        >Забыли пароль?</button>
      }
      </div>
    </>
  );
}
