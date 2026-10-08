import { useNavigate } from 'react-router';
import ImageCard from '../../../components/ImageCard';
import SaveToggleButton from '../../../components/SaveToggleButton';
import PeopleIcon from '../../../assets/svg/Recipe/people.svg?react';
import { useSavedRecipes } from '../SavedRecipesContext';
import ExpiredNotice from './ExpiredNotice';
import styles from './RecipeCard.module.css';

// 서버 portion은 이미 "1인분"처럼 단위가 붙어 온다. 숫자만 올 때만 "인분"을 붙인다 (F7)
function formatServings(servings) {
  const text = String(servings).trim();
  return /^\d+(\.\d+)?$/.test(text) ? `${text}인분` : text;
}

export default function RecipeCard({
  id,
  title,
  imageSrc,
  servings,
  expiredIngredients,
}) {
  const navigate = useNavigate();
  const { isSaved, add, remove } = useSavedRecipes();
  const saved = isSaved(id);

  // 상세의 지난 재료 안내는 상세 응답에 들어 있다 (D-038)
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
            <span className={styles.servingsText}>
              {formatServings(servings)}
            </span>
          </div>
        )}

        <ExpiredNotice names={expiredIngredients} compact />
      </div>
    </div>
  );
}
