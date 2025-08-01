import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Home.module.css';
import Nav from '../../components/Nav';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';
import SearchInput from './components/SearchInput';
import AlertCard from './components/AlertCard';
import ImageCoin from '../../components/ImageCoin';
import ImageCard from '../../components/ImageCard';

export default function Main({ username = '홍길동' }) {
  const navigate = useNavigate();
  const imageData = [
    { id: 1, imageSrc: '', text: '요리1', variant: 'large' },
    { id: 2, imageSrc: '', text: '요리2', variant: 'large' },
    { id: 3, imageSrc: '', text: '요리3', variant: 'large' },
    { id: 4, imageSrc: '', text: '요리4', variant: 'large' },
  ];

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

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
        <AlertCard onClick={() => navigate('/fridge')} />

        <h3 className={styles.recommendTitle}>레시피 추천</h3>
        <div className={styles.recipeList}>
          <ImageCoin imageSrc="" text="15분 이내" variant="medium" />
          <ImageCoin imageSrc="" text="든든 한끼" variant="medium" />
          <ImageCoin imageSrc="" text="추천3" variant="medium" />
          <ImageCoin imageSrc="" text="추천4" variant="medium" />
          <ImageCoin imageSrc="" text="추천5" variant="medium" />
        </div>
        <h3 className={styles.recommendTitle}>요즘 많이 찾는 레시피</h3>
        <div className={styles.content}>
          {imageData.map((item) => (
            <div key={item.id} onClick={() => handleCardClick(item.id)}>
              <ImageCard
                imageSrc={item.imageSrc}
                text={item.text}
                variant={item.variant}
              />
            </div>
          ))}
        </div>
      </div>
      <Nav />
    </>
  );
}
