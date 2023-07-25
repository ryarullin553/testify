import React, { FC } from 'react';
import styles from './contrast-button.module.scss';

interface Props {
  type: string,
  label: string,
  inversed: boolean,
  onClick: () => void,
}

export const ContrastButton: FC<Props> = ({ type, label, inversed, onClick }) => {
  let elem = <></>;
  let buttonStyle = styles.contrastButton;
  if (inversed) {
    buttonStyle += ` ${styles.inversed}`;
  }
  if (type === 'button') {
    elem = <button className={buttonStyle} onClick={onClick}>{label}</button>;
  } else if (type === 'link') {
    elem = <a className={buttonStyle} onClick={onClick}>{label}</a>;
  }

  return elem;
}
