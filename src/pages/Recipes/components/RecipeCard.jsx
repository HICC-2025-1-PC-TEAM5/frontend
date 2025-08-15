import { useNavigate } from 'react-router';
import ImageCard from '../../../components/ImageCard';
import SaveToggleButton from '../../../components/SaveToggleButton';
import PeopleIcon from '../../../assets/svg/Recipe/people.svg?react';
import { useSavedRecipes } from '../SavedRecipesContext';
import styles from './RecipeCard.module.css';

export default function RecipeCard({ id, title, imageSrc, servings }) {
  const navigate = useNavigate();
  const { isSaved, add, remove } = useSavedRecipes();
  const saved = isSaved(id);

  const goDetail = () => navigate(`/recipes/${id}`);

  return (
    <div className={styles.card}>
      <button type="button" className={styles.imageBtn} onClick={goDetail}>
        {/* ImageCard는 text prop 사용 */}
        <ImageCard imageSrc={imageSrc} text="" variant="large" />
      </button>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>

          <SaveToggleButton
            saved={saved}
            onToggle={(next) => {
              if (next) {
                // 서버 동기화 컨텍스트는 recipeId만 필요
                add(id);
              } else {
                remove(id);
              }
            }}
          />
        </div>

        {servings != null && (
          <div className={styles.descRow}>
            <PeopleIcon className={styles.peopleIcon} />
            <span className={styles.servingsText}>{`${servings} 인분`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
