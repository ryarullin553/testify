import { FC } from 'react';
import styles from './avatar-block.module.scss';

interface Props {
  src: string,
  size: number,
  additionalStyle?: string,
}

export const AvatarBlock: FC<Props> = ({src, size, additionalStyle}) => {
  if (!src) {
    return <div className={`${styles.placeholder} ${additionalStyle}`} style={ { height: size, width: size } }/>
  }

  return (
    <img className={`${styles.image} ${additionalStyle}`} style={ { height: size, width: size } } src={src}/>
  );
}
