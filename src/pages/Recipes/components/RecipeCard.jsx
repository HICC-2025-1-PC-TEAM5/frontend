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
        {/* text prop로 맞춰줌 */}
        <ImageCard imageSrc={imageSrc} text="" variant="large" />
      </button>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>

          <SaveToggleButton
            saved={saved}
            onToggle={(next) => {
              if (next) {
                // 프로필의 “저장한 요리”에서 바로 쓸 수 있게 메타데이터 함께 저장
                add({ id, title, imageSrc, servings });
              } else {
                remove(id);
              }
            }}
          />
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
