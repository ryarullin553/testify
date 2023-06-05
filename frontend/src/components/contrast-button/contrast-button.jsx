import styles from './contrast-button.module.scss'

export const ContrastButton = ({type, label, inversed, onClick}) => {
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
