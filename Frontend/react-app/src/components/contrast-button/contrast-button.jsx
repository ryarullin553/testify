import styles from './contrast-button.module.scss'

export const ContrastButton = ({type, label, inversed}) => {
  let elem = <></>;
  let buttonStyle = styles.contrastButton;
  if (inversed) {
    buttonStyle += ` ${styles.inversed}`;
  }
  if (type === 'button') {
    elem = <button className={buttonStyle}>{label}</button>;
  } else if (type === 'link') {
    elem = <a className={buttonStyle}>{label}</a>;
  }

  return elem;
}
