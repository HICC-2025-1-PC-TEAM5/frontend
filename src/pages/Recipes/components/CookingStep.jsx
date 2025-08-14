import Button from '../../../components/Button';
import styles from './CookingStep.module.css';

export default function CookingStep({ Number, title, description }) {
  return (
    <div className={styles.container}>
      <Button size="small">{Number}</Button>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
