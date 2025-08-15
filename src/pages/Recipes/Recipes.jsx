// src/pages/Recipes/Recipes.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Recipes.module.css';
import SelectHeader from './components/SelectHeader';
import Nav from '../../components/Nav';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import OptionsInput from '../../components/OptionsInput';
import RecipeCard from './components/RecipeCard';
import { useUser } from '../UserContext';
import api from '../../lib/api'; // 서버로 직접 호출
import { buildRecommendParams } from '../../lib/preference';

function Recipes() {
  const { username, id: ctxUserId } = useUser() || {};
  const userId = ctxUserId || localStorage.getItem('userId');
  const name = username || '사용자';
  const navigate = useNavigate();

  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');

  const handleSortChange = (v) => {
    const next = v?.target ? v.target.value : v;
    setSort(next);
    fetchRecipes(next);
  };

  async function fetchRecipes(sortKey = sort) {
    try {
      setLoading(true);
      setError('');
      if (!userId) throw new Error('로그인이 필요합니다.');

      // 1) 추천 파라미터 구성
      const params = await buildRecommendParams(userId);
      if (sortKey) params.sort = sortKey;

      // 2) GET + querystring으로 호출 (415 방지)
      const { data } = await api.get(`/api/users/${userId}/recipes`, {
        params,
      });

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
            </OptionsInput>
          </div>
        </Wrapper>
      </div>

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
