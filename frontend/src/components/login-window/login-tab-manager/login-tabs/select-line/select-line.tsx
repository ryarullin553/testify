import { FORM_TABS } from '../../../login-window';
import styles from './select-line.module.scss';
import React, { FC } from 'react';

interface Props {
  formTab: FORM_TABS,
}

export const SelectLine: FC<Props> = ({ formTab }) => {
    const selectLinePosition = () => {
    switch (formTab) {
      case FORM_TABS.SIGN_IN:
        return '-100px';
      case FORM_TABS.SIGN_UP:
        return '-3px';
      case FORM_TABS.RESET:
        return '-200px';
      default:
        return '-200px';
    }
  }
  return (
    <div className={styles.selectLine} style={{backgroundPosition: selectLinePosition()}}/>
  )
};
