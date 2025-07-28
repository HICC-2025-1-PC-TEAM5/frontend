import { useState } from 'react';
import styles from './Footer.module.css';

import Home from '../../assets/svg/Footer/home.svg?react';
import Recipe from '../../assets/svg/Footer/recipe.svg?react';
import Refridge from '../../assets/svg/Footer/refridge.svg?react';
import MyPage from '../../assets/svg/Footer/mypage.svg?react';

const tabs = [
  { id: 'a', label: '홈', Icon: Home },
  { id: 'b', label: '레시피 추천', Icon: Recipe },
  { id: 'c', label: '냉장고 관리', Icon: Refridge },
  { id: 'd', label: '마이페이지', Icon: MyPage },
];

export default function Footer() {
  const [selected, setSelected] = useState('a');

  return (
    <div className={styles.segmentedControl}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`${styles.tabButton} ${
            selected === id ? styles.active : ''
          }`}
          onClick={() => setSelected(id)}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}
