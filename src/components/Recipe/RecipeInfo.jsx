import styles from './RecipeInfo.module.css';

import TimeIcon from '../../assets/svg/Recipe/time.svg?react';
import PeopleIcon from '../../assets/svg/Recipe/people.svg?react';
import UsageIcon from '../../assets/svg/Recipe/people.svg?react';
import DifficultyIcon from '../../assets/svg/Recipe/people.svg?react';

function RecipeInfo({
  imageSrc = '',
  name = '요리 이름',
  description = '요리 한 줄 소개 어쩌고',
  time = '1-2시간',
  people = '1-2인분',
}) {
  return (
    <div className={styles.container}>
      {imageSrc ? (
        <img src={imageSrc} alt={name} className={styles.image} />
      ) : (
        <div className={styles.placeholder}></div>
      )}
      <div className={styles.header}>
        <h2 className={styles.name}>{name}</h2>
        <div className={styles.meta}>
          <TimeIcon className={styles.icon} />
          <span>{time}</span>
          <PeopleIcon className={styles.icon} />
          <span>{people}</span>
        </div>
        <button className={styles.saveBtn}>저장</button>
      </div>

      <p className={styles.description}>{description}</p>

      {/* 활용도 & 난이도 */}
      <div className={styles.tags}>
        <div className={styles.tag}>
          <UsageIcon className={styles.tagIcon} />
          <span>재료 활용도</span>
        </div>
        <div className={styles.tag}>
          <DifficultyIcon className={styles.tagIcon} />
          <span>난이도</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeInfo;
