import { FC } from 'react'
import styles from './ImageDropZone.module.scss'

interface Props {}

export const ImageDropZone: FC<Props> = () => {
  return (
    <fieldset className={styles.testLogo}>
      <label>Аватар</label>
      <div className={classNames(styles.dropZone, false && styles.active)}>
        <p>png-файл с прозрачностью 230х230px</p>
        <input type='file' id='image' name='image' accept='image/png' />
      </div>
    </fieldset>
  )
}
