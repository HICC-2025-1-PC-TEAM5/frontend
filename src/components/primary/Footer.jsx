import { NavLink } from 'react-router';

import styles from './Footer.module.css';

import Home from '../../assets/svg/Footer/home.svg?react';
import Recipe from '../../assets/svg/Footer/recipe.svg?react';
import Refridge from '../../assets/svg/Footer/refridge.svg?react';
import MyPage from '../../assets/svg/Footer/mypage.svg?react';

const tabs = [
  { label: '홈', Icon: Home, url: '/' },
  { label: '레시피 추천', Icon: Recipe, url: '/recipes' },
  { label: '냉장고 관리', Icon: Refridge, url: '/fridge' },
  { label: '마이페이지', Icon: MyPage, url: '/profile' },
];

export default function Footer() {
  return (
    <div className={styles.segmentedControl}>
      {tabs.map(({ label, Icon, url }) => (
        <NavLink
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
}
