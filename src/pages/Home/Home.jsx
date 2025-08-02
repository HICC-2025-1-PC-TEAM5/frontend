import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Home.module.css';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import Nav from '../../components/Nav';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';
import SearchInput from './components/SearchInput';
import AlertCard from './components/AlertCard';
import ImageCoin from '../../components/ImageCoin';
import ImageCard from '../../components/ImageCard';

export default function Main({ username = '홍길동' }) {
  const navigate = useNavigate();
  const imageData = [
    { id: 1, imageSrc: '', title: '요리1', desc: 'large' },
    { id: 2, imageSrc: '', title: '요리2', desc: 'large' },
    { id: 3, imageSrc: '', title: '요리3', desc: 'large' },
    { id: 4, imageSrc: '', title: '요리4', desc: 'large' },
  ];

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <>
      <div className={styles.header}>
        <Wrapper>
          <Stack>
            <LogoIcon className={styles.logoIcon} />
            <h1 className={styles.logoTitle}>오늘도 썩는 중</h1>
          </Stack>

          <h1 className={styles.greeting}>
            안녕하세요 {username}님
            <br />
            오늘은 어떤 음식을 만들어볼까요?
          </h1>

          <div className={styles.headerSearch}>
            <SearchInput onSearch={(value) => console.log(value)} />
          </div>

          <div className={styles.headerAlert}>
            <AlertCard onClick={() => navigate('/fridge')} />
          </div>
        </Wrapper>
      </div>

      <div className={styles.recommands}>
        <Wrapper>
          <h3 className={styles.recommendTitle}>레시피 추천</h3>
          <Stack>
            <ImageCoin imageSrc="" text="15분 이내" variant="medium" />
            <ImageCoin imageSrc="" text="든든 한끼" variant="medium" />
            <ImageCoin imageSrc="" text="추천3" variant="medium" />
            <ImageCoin imageSrc="" text="추천4" variant="medium" />
            <ImageCoin imageSrc="" text="추천5" variant="medium" />
          </Stack>
        </Wrapper>
      </div>

      <div className={styles.popular}>
        <Wrapper>
          <h3 className={styles.recommendTitle}>요즘 많이 찾는 레시피</h3>
          <Stack rows="3" wrap="wrap">
            {imageData.map((item) => (
              <div key={item.id} onClick={() => handleCardClick(item.id)}>
                <ImageCard
                  imageSrc={item.imageSrc}
                  title={item.title}
                  desc={item.desc}
                />
              </div>
            ))}
          </Stack>
        </Wrapper>
      </div>

      <Nav />
    </>
  );
}
