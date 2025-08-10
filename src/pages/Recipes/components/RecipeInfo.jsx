import styles from './RecipeInfo.module.css';

import TimeIcon from '../../../assets/svg/Recipe/time.svg?react';
import PeopleIcon from '../../../assets/svg/Recipe/people.svg?react';
import UsageIcon from '../../../assets/svg/Recipe/people.svg?react';
import DifficultyIcon from '../../../assets/svg/Recipe/people.svg?react';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import Stars from '../../../components/Stars';
import SaveToggleButton from '../../../components/SaveToggleButton';
import { useSavedRecipes } from '../SavedRecipesContext';

function RecipeInfo({
  id,
  imageSrc = '',
  name = '요리 이름',
  description = '요리 한 줄 소개 어쩌고',
  time = '1-2시간',
  people = '1-2인분',
}) {
  const { isSaved, add, remove } = useSavedRecipes();
  const saved = isSaved(id);
  return (
    <>
      <div className={styles.image}>
        {imageSrc ? (
          <img src={imageSrc} alt={name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>

      <div className={styles.info}>
        <Stack className={styles.title} justify="space-between" align="center">
          <h2>{name}</h2>
          <SaveToggleButton
            defaultSaved={saved}
            onToggle={(next) => (next ? add(id) : remove(id))}
          />
        </Stack>

        <div className={styles.desc}>
          <p>{description}</p>
        </div>

        {/*<div className={styles.meta}>
          <TimeIcon className={styles.icon} />
          <span>{time}</span>
          <PeopleIcon className={styles.icon} />
          <span>{people}</span>
        </div>*/}

        <div className={styles.levels}>
          <Stack>
            <Stars level="5" text="재료 활용도"></Stars>
            <Stars level="2" text="난이도"></Stars>
          </Stack>
        </div>
      </div>
    </>
  );
}

export default RecipeInfo;
