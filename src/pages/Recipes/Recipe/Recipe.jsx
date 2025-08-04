import { useNavigate } from 'react-router';
import styles from './Recipe.module.css';
import RecipeInfo from '../components/RecipeInfo';
import ImageCoin from '../../../components/ImageCoin';
import Button from '../../../components/Button';
import PeopleCounter from '../components/PeopleCounter';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';

const ingredientsNo = [
  { id: 1, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 2, imageSrc: '', text: '이름', variant: 'medium' },
];

const ingredientsYes = [
  { id: 1, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 2, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 3, imageSrc: '', text: '이름', variant: 'medium' },
  { id: 4, imageSrc: '', text: '이름', variant: 'medium' },
];

function Recipe() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={styles.header}>
        <Wrapper fill="height">
          <Stack justify="space-between" align="center" fill="all" gap="none">
            <div className={styles.headerSide}>
              <button
                variant="invisible"
                onClick={handleBack}
                className={styles.backButton}
                icon="only"
              >
                <span icon="icon">←</span>
              </button>
            </div>
            <div className={styles.headerMain}>
              <p className={styles.headerTitle}>레시피</p>
            </div>
            <div className={styles.headerSide}></div>
          </Stack>
        </Wrapper>
      </div>
      <div className={styles.headerMargin}></div>

      <div className={styles.recipe}>
        <Wrapper>
          <RecipeInfo />
        </Wrapper>
      </div>

      <div className={styles.ingredients}>
        <Wrapper>
          <h2>재료</h2>

          <h4>없어요</h4>
          <Stack>
            {ingredientsNo.map((item) => (
              <ImageCoin
                key={item.id}
                imageSrc={item.imageSrc}
                text={item.text}
              />
            ))}
          </Stack>

          <h4>있어요</h4>
          <Stack>
            {ingredientsYes.map((item) => (
              <ImageCoin
                key={item.id}
                imageSrc={item.imageSrc}
                text={item.text}
              />
            ))}
          </Stack>
        </Wrapper>
      </div>

      {/*<div className={styles.tools}>
        <Wrapper>
          <h2>조리도구</h2>
          <Stack gap="narrow">
            <Button variant="activate" size="small">
              프라이팬
            </Button>
            <Button variant="default" size="small">
              집게
            </Button>
            <Button variant="default" size="small">
              접시
            </Button>
          </Stack>
        </Wrapper>
      </div>*/}

      <div className={styles.control}>
        <Wrapper fill="height">
          <PeopleCounter />
        </Wrapper>
      </div>
      <div className={styles.controlMargin}></div>
    </>
  );
}

export default Recipe;
