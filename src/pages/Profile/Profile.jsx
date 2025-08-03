import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './Profile.module.css';
import Button from '../../components/Button';
import Nav from '../../components/Nav';
import PreferenceInfo from './components/PreferenceInfo';
import PersonalInfo from './components/PersonalInfo';
import ImageCard from '../../components/ImageCard';
import Stack from '../../components/Stack';
import Wrapper from '../../components/Wrapper';

export default function Profile({ username = '홍길동' }) {
  const navigate = useNavigate();

  const imageData = [
    { id: 1, imageSrc: '/img/recipe1.jpg', text: '레시피 1', variant: 'large' },
    { id: 2, imageSrc: '/img/recipe2.jpg', text: '레시피 2', variant: 'large' },
    { id: 3, imageSrc: '/img/recipe3.jpg', text: '레시피 3', variant: 'large' },
  ];

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <Wrapper>
          <Stack
            className={styles.header}
            justify="space-between"
            align="center"
            fill="width"
          >
            <Stack className={styles.headerProfile} align="center">
              <div className={styles.profileImageWrapper}>
                <img
                  src="/img/profile.jpg"
                  alt="프로필"
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.profileTextWrapper}>
                <h2 className={styles.username}>{username}님</h2>

                <Stack gap="narrow">
                  <Button size="small">20대</Button>
                  <Button size="small">자취</Button>
                  <Button size="small">1인 가구</Button>
                </Stack>
              </div>
            </Stack>
            <div className={styles.headerSettings}>
              <Link to="/profile/settings">
                <Button>설정</Button>
              </Link>
            </div>
          </Stack>

          <PreferenceInfo />
          <PersonalInfo />

          <h3 className={styles.recommendTitle}>저장한 요리</h3>
          <div className={styles.content}>
            {imageData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={styles.cardWrapper}
              >
                <ImageCard
                  imageSrc={item.imageSrc}
                  text={item.text}
                  variant={item.variant}
                />
              </div>
            ))}
          </div>
        </Wrapper>
      </div>

      <Nav />
    </>
  );
}
