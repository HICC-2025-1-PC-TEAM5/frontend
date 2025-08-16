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
import api from '../../lib/api';
import { buildRecommendParams } from '../../lib/preference';
import {} from /* optional: getIngredients */ '../../lib/fridge'; // 안 써도 되지만 참고용

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

  // 어떤 입력이 와도 문자열 배열로 정규화
  const toArray = (v) =>
    Array.isArray(v)
      ? v.map(String)
      : v
        ? String(v)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

  // 냉장고 재료 이름 로드 → ["감자","고구마",...]
  async function fetchFridgeNames(uid) {
    try {
      const { data } = await api.get(`/api/users/${uid}/fridge/ingredients`);
      // 다양한 응답 스키마 방어
      const arr =
        (Array.isArray(data) && data) ||
        data?.refrigeratorIngredient ||
        data?.ingredients ||
        [];
      const names = (arr || []).map((it) => it?.name).filter(Boolean);
      // 중복 제거
      return Array.from(new Set(names));
    } catch {
      return [];
    }
  }

  async function fetchRecipes(sortKey = sort) {
    try {
      setLoading(true);
      setError('');
      if (!userId) throw new Error('로그인이 필요합니다.');

      // 1) 냉장고 재료 이름 추출
      const fridgeNames = await fetchFridgeNames(userId);

      // 2) 폴백: 냉장고가 비면 선호 재료(좋아요) 사용
      let bodyArray = fridgeNames;
      if (!bodyArray.length) {
        const built = await buildRecommendParams(userId);
        bodyArray = toArray(built?.likeIngredients);
      }

      //    정렬은 쿼리스트링으로 전달
      const { data } = await api.post(
        `/api/users/${userId}/recipes`,
        bodyArray,
        { params: sortKey ? { sort: sortKey } : {} }
      );

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
