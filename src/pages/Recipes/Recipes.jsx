// src/pages/Recipes/Recipes.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Recipes.module.css';
import SelectHeader from './components/SelectHeader';
import Nav from '../../components/Nav';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import RecipeCard from './components/RecipeCard';
import { useUser } from '../UserContext';
import { fetchRecommendedRecipes } from '../../lib/recipes';

function Recipes() {
  // 로그인 사용자의 id만 쓴다 (D-012)
  const { username, id: userId } = useUser() || {};
  const name = username || '사용자';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');

  // 재료는 서버가 냉장고에서 고른다 (C1, D-018)
  async function fetchRecipes() {
    try {
      setLoading(true);
      setError('');
      if (!userId) throw new Error('로그인이 필요합니다.');

      const data = await fetchRecommendedRecipes(userId);
      setList(Array.isArray(data?.recipe) ? data.recipe : []);
    } catch (e) {
      setList([]);
      setError(e?.message || '레시피를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

      {/* 정렬(인기순·최신순)은 서버에 기준 데이터가 없어 숨긴다. 레시피 로컬 DB 전환 때 다시 넣는다 (D-018) */}

      <div className={styles.recipes}>
        <Wrapper>
          {loading && <div className={styles.state}>불러오는 중…</div>}
          {!loading && error && <div className={styles.state}>{error}</div>}
          {!loading && !error && list.length === 0 && (
            <div className={styles.state}>추천 레시피가 없습니다.</div>
          )}

          {!loading && !error && list.length > 0 && (
            <Stack className={styles.recipesIndex} rows="2" wrap="wrap">
              {list.map((r) => (
                <RecipeCard
                  key={`${r.id}-${r.name}`}
                  id={r.id}
                  title={r.name}
                  imageSrc={r.image}
                  servings={r.portion}
                  expiredIngredients={r.expiredIngredients}
                />
              ))}
            </Stack>
          )}
        </Wrapper>
      </div>

      <Nav />
    </>
  );
}

export default Recipes;
