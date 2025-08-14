import { useState } from 'react';
import styles from './SelectHeader.module.css';
import Stack from '../../../components/Stack';
import { NavLink, useLocation } from 'react-router';

import IconA from '../../../assets/svg/Recipe/iconA.svg?react';

import IconC from '../../../assets/svg/Recipe/iconC.svg?react';
import IconD from '../../../assets/svg/Recipe/iconD.svg?react';
import IconG from '../../../assets/svg/Recipe/iconG.svg?react';
import IconF from '../../../assets/svg/Recipe/iconF.svg?react';

const tabs = [
  { id: 'all', label: '전체', Icon: IconA },
  { id: 'c', label: '식사류', Icon: IconC },
  { id: 'g', label: '국', Icon: IconG },
  { id: 'd', label: '반찬', Icon: IconD },

  { id: 'f', label: '간식', Icon: IconF },
];

export default function SelectHeader() {
  const location = useLocation();

  return (
    <Stack
      className={styles.nav}
      justify="start"
      align="center"
      gap="wide"
      fill="width"
    >
      {tabs.map(({ label, Icon, id }) => (
        <NavLink
          key={id}
          to={id !== 'all' ? `?category=${id}` : ''}
          className={() => {
            const category = new URLSearchParams(location.search).get(
              'category'
            );
            let className = `${styles.button}`;
            if (category === id || (!location.search && id === 'all')) {
              className += ` ${styles.active}`;
            }
            return className;
          }}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </Stack>
  );
}
