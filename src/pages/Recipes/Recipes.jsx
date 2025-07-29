import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Recipes.module.css';
import SelectHeader from './components/SelectHeader';
import ImageCard from '../../components/ImageCard';
import Nav from '../../components/Nav';

const imageData = [
  { id: 1, imageSrc: '', text: '요리1', variant: 'large' },
  { id: 2, imageSrc: '', text: '요리2', variant: 'large' },
  { id: 3, imageSrc: '', text: '요리3', variant: 'large' },
  { id: 4, imageSrc: '', text: '요리4', variant: 'large' },
];

function Recipes() {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };
  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>이 요리들 어떤가요</h1>
          <SelectHeader />
        </div>

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
      <Nav></Nav>
    </>
  );
}

export default Recipes;
