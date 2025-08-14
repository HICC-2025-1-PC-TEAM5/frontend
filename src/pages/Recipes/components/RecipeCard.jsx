import { useNavigate } from 'react-router';
import ImageCard from '../../../components/ImageCard'; // ✅ ImageCard
import SaveToggleButton from '../../../components/SaveToggleButton';
import PeopleIcon from '../../../assets/svg/Recipe/people.svg?react';
import { useSavedRecipes } from '../SavedRecipesContext';
import styles from './RecipeCard.module.css';

export default function RecipeCard({ id, title, imageSrc, servings }) {
  const navigate = useNavigate();
  const { isSaved, add, remove, toggle } = useSavedRecipes();
  const saved = isSaved(id);
  const goDetail = () => navigate(`/recipes/${id}`);

  return (
    <div className={styles.card}>
      <button type="button" className={styles.imageBtn} onClick={goDetail}>
        <ImageCard imageSrc={imageSrc} title="" variant="large" />
      </button>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3> {/* ✅ 오타 수정 */}
          <SaveToggleButton recipeId={id} />
        </div>

        {servings != null && (
          <div className={styles.descRow}>
            <PeopleIcon className={styles.peopleIcon} />
            <span className={styles.servingsText}>
              {typeof servings === 'number'
                ? `${servings} 인분`
                : `${servings} 인분`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
