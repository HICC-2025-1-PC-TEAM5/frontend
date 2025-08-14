import { useState } from 'react';
import styles from './CategorySelect.module.css';

const mainCategories = [
  { id: 'all', label: '전체' },
  { id: 'fridge', label: '냉장고' },
  { id: 'freezer', label: '냉동실' },
  { id: 'room', label: '실온' },
];

const subCategoriesMap = {
  all: [{ id: 'all', label: '전체' }],
  fridge: [
    { id: 'all', label: '전체' },
    { id: 'vegetable', label: '채소' },
    { id: 'fruit', label: '과일' },
    { id: 'meat', label: '고기/해산물' },
    { id: 'dairy', label: '계란/유제품' },
    { id: 'condiment', label: '양념/조미료' },
    { id: 'etc', label: '기타' },
  ],
  freezer: [
    { id: 'all', label: '전체' },
    { id: 'vegetable', label: '채소' },
    { id: 'fruit', label: '과일' },
    { id: 'meat', label: '고기/해산물' },
    { id: 'processed', label: '가공식품' },
    { id: 'etc', label: '기타' },
  ],
  room: [
    { id: 'all', label: '전체' },
    { id: 'roomVeg', label: '실온채소' },
    { id: 'grain', label: '곡류/건조식품' },
    { id: 'spice', label: '조미료/향신료' },
    { id: 'processed', label: '가공식품' },
    { id: 'etc', label: '기타' },
  ],
};

export default function CategorySelect() {
  const [mainSelected, setMainSelected] = useState('fridge');
  const [subSelected, setSubSelected] = useState('all');

  const subCategories = subCategoriesMap[mainSelected];

  return (
    <div className={styles.wrapper}>
      {/* 상위 카테고리 */}
      <div className={styles.segmentedControl}>
        {mainCategories.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.tabButton} ${
              mainSelected === id ? styles.active : ''
            }`}
            onClick={() => {
              setMainSelected(id);
              setSubSelected('all'); // 새 상위 카테고리 선택 시 하위는 전체로 초기화
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 하위 카테고리 */}
      <div className={styles.subControl}>
        {subCategories.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.tabButton} ${
              subSelected === id ? styles.active : ''
            }`}
            onClick={() => setSubSelected(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
