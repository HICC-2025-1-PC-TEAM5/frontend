import { useState } from 'react';
import SaveOutline from '../assets/svg/Recipe/save.svg?react';
import SaveFilled from '../assets/svg/Recipe/savefilled.svg?react';
import styles from './SaveToggleButton.module.css';
import { useSavedRecipes } from '../pages/Recipes/SavedRecipesContext';

export default function SaveToggleButton({
  recipeId,
  size = '1.6rem',
  stopPropagation = true,
  pulseDuration = 180,
}) {
  const [anim, setAnim] = useState(false);
  const { isSaved, add, remove } = useSavedRecipes();
  const saved = isSaved(String(recipeId));

  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    e.preventDefault(); // 혹시 상위에 Link가 남아있어도 이동 방지
    saved ? remove(String(recipeId)) : add(String(recipeId));
    setAnim(true);
    setTimeout(() => setAnim(false), pulseDuration);
  };

  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${saved ? styles.on : ''} ${anim ? styles.pulse : ''}`}
      aria-pressed={saved}
      aria-label={saved ? '저장 취소' : '레시피 저장'}
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      {saved ? <SaveFilled /> : <SaveOutline />}
    </button>
  );
}
