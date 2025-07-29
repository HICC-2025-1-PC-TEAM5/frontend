import { useNavigate } from 'react-router';
import styles from './Recipe.module.css';
import RecipeInfo from '../../../components/Recipe/RecipeInfo';
import ImageCoin from '../../../components/primary/ImageCoin';
import Button from '../../../components/primary/Button';

const ingredientsNo = [
  { id: 1, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 2, imageSrc: '', text: '이름', variant: 'medium' },
];

const ingredientsYes = [
  { id: 1, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 2, imageSrc: '', text: '이름', variant: 'medium' },
];
function Recipe() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>레시피</h1>
      </header>
      {/*요리 정보*/}
      <RecipeInfo />
      {/*재료 표시*/}
      <section className={styles.ingredientsSection}>
        <h2 className={styles.subtitle}>재료</h2>

        <h3 className={styles.label}>없어요</h3>
        <div className={styles.imageCoinList}>
          {ingredientsNo.map((item) => (
            <ImageCoin
              key={item.id}
              imageSrc={item.imageSrc}
              text={item.text}
              variant={item.variant}
            />
          ))}
        </div>

        <h3 className={styles.label}>있어요</h3>
        <div className={styles.imageCoinList}>
          {ingredientsYes.map((item) => (
            <ImageCoin
              key={item.id}
              imageSrc={item.imageSrc}
              text={item.text}
              variant={item.variant}
            />
          ))}
        </div>
      </section>
      {/*조리도구*/}
      <section className={styles.toolsSection}>
        <h2 className={styles.subtitle}>조리도구</h2>
        <div className={styles.toolsButtonGroup}>
          <Button variant="activate">프라이팬</Button>
          <Button variant="default">접시</Button>
          <Button variant="default">요리 집게</Button>
        </div>
      </section>
    </div>
  );
}

export default Recipe;
