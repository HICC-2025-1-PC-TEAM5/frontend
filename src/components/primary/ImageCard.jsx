import styles from './ImageCard.module.css';

function ImageCard(props) {
  const { children, img, title } = props;

  return (
    <div className={styles.ImageCard}>
      <div className='image'></div>
      <div className='description'>
        <div className='title'>{title}</div>
        <div className='content'>{children}</div>
      </div>
    </div>
  );
}

export default ImageCard;
