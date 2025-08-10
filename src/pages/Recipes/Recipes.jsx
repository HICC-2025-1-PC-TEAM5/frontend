import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './Recipes.module.css';
import SelectHeader from './components/SelectHeader';
import ImageCard from '../../components/ImageCard';
import Nav from '../../components/Nav';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import { useUser } from '../UserContext'; // ✅ UserContext 불러오기
import OptionsInput from '../../components/OptionsInput';
import RecipeCard from './components/RecipeCard';

const recipes = [
  { id: 1, imageSrc: '', title: '레시피 1', servings: '1-2' },
  { id: 2, imageSrc: '', title: '레시피 2', servings: '1-2' },
  { id: 3, imageSrc: '', title: '레시피 3', servings: '1-2' },
  { id: 4, imageSrc: '', title: '레시피 4', servings: '1-2' },
  { id: 5, imageSrc: '', title: '레시피 5', servings: '1-2' },
  { id: 6, imageSrc: '', title: '레시피 6', servings: '1-2' },
];

function Recipes() {
  const { username } = useUser(); // ✅ 여기 수정
  const name = username || '사용자';
  const navigate = useNavigate();
  const [sort, setSort] = useState('popular');
  const handleSortChange = (v) => {
    const next = v?.target ? v.target.value : v;
    setSort(next);
  };
  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <>
      <div className={styles.header}>
        <Wrapper>
          <h1 className={styles.title}>레시피 추천</h1>
          <p className={styles.subtitle}>
            {name}님의 냉장고 재료들로 만들 수 있는 요리들이에요
          </p>
          <SelectHeader />
        </Wrapper>
        <div className={styles.headerBlur}></div>
      </div>
      <div className={styles.toolbar}>
        <Wrapper>
          <div className={styles.sortBox}>
            <OptionsInput
              defaultValue="popular"
              onChange={handleSortChange}
              size="small"
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="difficulty">난이도순</option>
            </OptionsInput>
          </div>
        </Wrapper>
      </div>
      <div className={styles.recipes}>
        <Wrapper>
          <Stack className={styles.recipesIndex} rows="2" wrap="wrap">
            {recipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  imageSrc={recipe.imageSrc}
                  servings={recipe.servings}
                />
              </Link>
            ))}
          </Stack>
        </Wrapper>
      </div>

      <Nav />
    </>
  );
}

export default Recipes;
