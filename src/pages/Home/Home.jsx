import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Home.module.css';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import Nav from '../../components/Nav';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';
import SearchInput from './components/SearchInput';
import AlertCard from './components/AlertCard';
import ImageCard from '../../components/ImageCard';
import IconC from '../../assets/svg/Recipe/iconC.svg?react';
import IconG from '../../assets/svg/Recipe/iconG.svg?react';
import IconD from '../../assets/svg/Recipe/iconD.svg?react';
import IconF from '../../assets/svg/Recipe/iconF.svg?react';
import { useUser } from '../UserContext'; // ✅ Context 불러오기

export default function Main() {
  const { username } = useUser(); // ✅ Context에서 username 가져오기
  const navigate = useNavigate();

  console.log("username: ", username);

  const imageData = [
    { id: 1, imageSrc: '', title: '요리1', desc: 'large' },
    { id: 2, imageSrc: '', title: '요리2', desc: 'large' },
    { id: 3, imageSrc: '', title: '요리3', desc: 'large' },
    { id: 4, imageSrc: '', title: '요리4', desc: 'large' },
    { id: 5, imageSrc: '', title: '요리5', desc: 'large' },
    { id: 6, imageSrc: '', title: '요리6', desc: 'large' },
  ];

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <>
      <div className={styles.header}>
        <Wrapper>
          <Stack gap="narrow">
            <LogoIcon className={styles.logoIcon} />
            <h1 className={styles.logoTitle}>오늘도 썩는 중</h1>
          </Stack>

          <h1 className={styles.greeting}>
            안녕하세요 {username}님
            <br />
            어떤 음식을 요리해볼까요
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
          <h3 className={styles.recommendTitle}>어떤 레시피를 원하시나요</h3>
          <div className={styles.homeCoinRow}>
            <div className={styles.homeCoin}>
              <div className={styles.homeCoinCircle}>
                <IconC />
              </div>
              <span className={styles.homeCoinText}>식사류</span>
            </div>
            <div className={styles.homeCoin}>
              <div className={styles.homeCoinCircle}>
                <IconG />
              </div>
              <span className={styles.homeCoinText}>국</span>
            </div>
            <div className={styles.homeCoin}>
              <div className={styles.homeCoinCircle}>
                <IconD />
              </div>
              <span className={styles.homeCoinText}>반찬</span>
            </div>
            <div className={styles.homeCoin}>
              <div className={styles.homeCoinCircle}>
                <IconF />
              </div>
              <span className={styles.homeCoinText}>간식 안주</span>
            </div>
          </div>
        </Wrapper>
      </div>

      <div className={styles.popular}>
        <Wrapper>
          <h3 className={styles.recommendTitle}>요즘 많이 찾는 레시피</h3>
          <Stack rows="2" wrap="wrap">
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
