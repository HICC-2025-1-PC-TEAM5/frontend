import { NavLink } from 'react-router';

import styles from './Nav.module.css';

import homeIcon from '../assets/svg/Nav/home.svg?react';
import recipeIcon from '../assets/svg/Nav/recipe.svg?react';
import fridgeIcon from '../assets/svg/Nav/refridge.svg?react';
import profileIcon from '../assets/svg/Nav/mypage.svg?react';

const tabs = [
  { url: '/', label: '홈', Icon: homeIcon },
  { url: '/recipes', label: '레시피', Icon: recipeIcon },
  { url: '/fridge', label: '냉장고', Icon: fridgeIcon },
  { url: '/profile', label: '프로필', Icon: profileIcon },
];

export default () => {
  return (
    <div className={styles.segmentedControl}>
      {tabs.map(({ label, Icon, url }) => (
        <NavLink
          key={url}
          to={url}
          className={({ isActive }) =>
            `${styles.tabButton} ${isActive ? styles.active : ''}`
          }
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};
