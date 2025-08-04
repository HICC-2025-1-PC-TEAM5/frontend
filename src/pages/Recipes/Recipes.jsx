import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './Recipes.module.css';
import SelectHeader from './components/SelectHeader';
import ImageCard from '../../components/ImageCard';
import Nav from '../../components/Nav';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';

const recipes = [
  { id: 1, imageSrc: '', title: '레시피 1', desc: '레시피 설명' },
  { id: 2, imageSrc: '', title: '레시피 2', desc: '레시피 설명' },
  { id: 3, imageSrc: '', title: '레시피 3', desc: '레시피 설명' },
  { id: 4, imageSrc: '', title: '레시피 4', desc: '레시피 설명' },
  { id: 5, imageSrc: '', title: '레시피 5', desc: '레시피 설명' },
  { id: 6, imageSrc: '', title: '레시피 6', desc: '레시피 설명' },
];

function Recipes() {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };
  return (
    <>
      <div className={styles.header}>
        <Wrapper>
          <h1 className={styles.title}>레시피</h1>
          <SelectHeader></SelectHeader>
        </Wrapper>
        <div className={styles.headerBlur}></div>
      </div>

      <div className={styles.recipes}>
        <Wrapper>
          <Stack className={styles.recipesIndex} rows="2" wrap="wrap">
            {recipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <ImageCard
                  imageSrc={recipe.imageSrc}
                  title={recipe.title}
                  desc={recipe.desc}
                />
              </Link>
            ))}
          </Stack>
        </Wrapper>
      </div>

      <Nav></Nav>
    </>
  );
}

export default Recipes;
