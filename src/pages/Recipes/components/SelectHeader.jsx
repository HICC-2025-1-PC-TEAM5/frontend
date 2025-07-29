import { useState } from 'react';
import styles from './SelectHeader.module.css';

import IconA from '../../../assets/svg/Recipe/iconA.svg?react';
import IconB from '../../../assets/svg/Recipe/iconB.svg?react';
import IconC from '../../../assets/svg/Recipe/iconC.svg?react';
import IconD from '../../../assets/svg/Recipe/iconD.svg?react';
import IconE from '../../../assets/svg/Recipe/iconE.svg?react';
import IconF from '../../../assets/svg/Recipe/iconF.svg?react';

const tabs = [
  { id: 'a', label: '전체', Icon: IconA },
  { id: 'b', label: '15분 이내', Icon: IconB },
  { id: 'c', label: '든든 한끼', Icon: IconC },
  { id: 'd', label: '건강 식단', Icon: IconD },
  { id: 'e', label: '재료 털기', Icon: IconE },
  { id: 'f', label: '간식 안주', Icon: IconF },
];

export default function SelectHeader() {
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
