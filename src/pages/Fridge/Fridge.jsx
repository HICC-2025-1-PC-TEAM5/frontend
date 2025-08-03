import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../components/Button';
import Nav from '../../components/Nav';
import ImageCoin from '../../components/ImageCoin';
import CategorySelect from './components/CategorySelect';
import styles from './Fridge.module.css';

export default function Fridge() {
  const suggestionItems = [
    { id: 1, imageSrc: '', text: '굴소스' },
    { id: 2, imageSrc: '', text: '액젓' },
    { id: 3, imageSrc: '', text: '면' },
    { id: 4, imageSrc: '', text: '숙주' },
  ];

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>식재료 관리</h1>
        <div className={styles.buttonGroup}>
          <Button variant="default">재료 추가</Button>
          <Button variant="default">재료 수정</Button>
        </div>
      </div>

      <div className={styles.recommands}>
        <div className={styles.message}>
          <p>이 재료들을 구비해보는 건 어떨까요?</p>
        </div>

        <div className={styles.imageList}>
          {suggestionItems.map((item) => (
            <ImageCoin
              key={item.id}
              imageSrc={item.imageSrc}
              text={item.text}
              variant="medium"
            />
          ))}
        </div>

        <Button variant="default" className={styles.actionButton}>
          조금만 넣어도 깊은 맛이 확 살아나요
        </Button>
      </div>
      <CategorySelect />
      <Nav />
    </>
  );
}
