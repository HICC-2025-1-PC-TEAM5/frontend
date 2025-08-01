import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Home.module.css';
import Nav from '../../components/Nav';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';
import SearchInput from './components/SearchInput';

export default function Main({ username = '홍길동' }) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoRow}>
          <LogoIcon className={styles.logoIcon} />
          <h1 className={styles.logoTitle}>오늘도 썩는 중</h1>
        </div>
        <h1 className={styles.greeting}>
          안녕하세요 {username}님
          <br />
          어떤 음식을 요리해볼까요?
        </h1>
        <SearchInput onSearch={(value) => console.log(value)} />
      </div>
      <Nav />
    </>
  );
}
