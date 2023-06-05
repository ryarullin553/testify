import styles from './avatar-block.module.scss';

export const AvatarBlock = ({src, size, additionalStyle}) => {
  if (!src) {
    return <div className={`${styles.placeholder} ${additionalStyle}`} style={ { height: size, width: size } }/>
  }

  return (
    <img className={`${styles.image} ${additionalStyle}`} style={ { height: size, width: size } } src={src}/>
  );
}
