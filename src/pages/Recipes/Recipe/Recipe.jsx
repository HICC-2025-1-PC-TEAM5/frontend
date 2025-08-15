// src/pages/Recipes/Recipe/Recipe.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './Recipe.module.css';
import RecipeInfo from '../components/RecipeInfo';
import ImageCoin from '../../../components/ImageCoin';
import Button from '../../../components/Button';
import PeopleCounter from '../components/PeopleCounter';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import CookingStep from '../components/CookingStep';
import { fetchRecipeDetail } from '../../../lib/recipes';
import { removeIngredientsByNames } from '../../../lib/fridge'; // ✅ 새 유틸 사용

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const [showSteps, setShowSteps] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ API 상태
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null); // { recipe, recipeGuide }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const userId =
          localStorage.getItem('userId') ||
          import.meta.env.VITE_DEV_USER_ID ||
          '1';
        const data = await fetchRecipeDetail(userId, id);
        setDetail(data);
      } catch (e) {
        setErr(e.message || '레시피 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const ingredientsYes = useMemo(() => {
    const raw = detail?.recipe?.ingredients || '';
    return raw
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, i) => ({ id: i + 1, imageSrc: '', text, variant: 'medium' }));
  }, [detail]);

  const ingredientsNo = []; // 서버 스펙 확정되면 교체

  // ✅ 조리 순서
  const steps = useMemo(() => {
    const arr = detail?.recipeGuide?.steps || [];
    // 백에서 stepNum, image, description 제공
    return arr.map((s) => ({
      step: s.stepNum,
      title: s.image ? '이미지 참고' : `STEP ${s.stepNum}`,
      desc: s.description,
      image: s.image,
    }));
  }, [detail]);

  const usedIngredientNames = useMemo(
    () => ingredientsYes.map((i) => i.text).filter(Boolean),
    [ingredientsYes]
  );

  const handleStart = () => setShowSteps(true);

  const handleComplete = async () => {
    try {
      setSaving(true);
      const userId =
        localStorage.getItem('userId') ||
        import.meta.env.VITE_DEV_USER_ID ||
        '1';
      await removeIngredientsByNames(userId, usedIngredientNames);
      navigate('/fridge');
    } catch (e) {
      console.error(e);
      alert('조리 완료 처리 중 오류가 발생했어요.');
    } finally {
      setSaving(false);
    }
  };

  const r = detail?.recipe;
  return (
    <>
      <div className={styles.header}>
        <Wrapper fill="height">
          <Stack justify="space-between" align="center" fill="all" gap="none">
            <div className={styles.headerSide}>
              <button
                onClick={handleBack}
                className={styles.backButton}
                aria-label="뒤로"
              >
                ←
              </button>
            </div>
            <div className={styles.headerMain}>
              <p className={styles.headerTitle}>레시피</p>
            </div>
            <div className={styles.headerSide}></div>
          </Stack>
        </Wrapper>
      </div>
      <div className={styles.headerMargin}></div>

      <div className={styles.recipe}>
        <Wrapper>
          {loading ? (
            <div>불러오는 중…</div>
          ) : err ? (
            <div>{err}</div>
          ) : (
            <RecipeInfo
              id={r?.id}
              imageSrc={r?.image}
              name={r?.name}
              description={`${r?.portion || ''} · ${r?.type || ''} · ${Math.round(r?.kcal || 0)} kcal`}
            />
          )}
        </Wrapper>
      </div>

      <div className={styles.ingredients}>
        <Wrapper>
          <h2>재료</h2>

          <h4>없어요</h4>
          <Stack>
            {ingredientsNo.length === 0 ? (
              <div>없음</div>
            ) : (
              ingredientsNo.map((item) => (
                <ImageCoin
                  key={item.id}
                  imageSrc={item.imageSrc}
                  text={item.text}
                />
              ))
            )}
          </Stack>

          <h4>있어요</h4>
          <Stack>
            {ingredientsYes.map((item) => (
              <ImageCoin
                key={item.id}
                imageSrc={item.imageSrc}
                text={item.text}
              />
            ))}
          </Stack>
        </Wrapper>
      </div>

      {!showSteps ? (
        <div className={styles.control}>
          <Wrapper fill="height">
            <PeopleCounter onStartCooking={handleStart} />
            <Button variant="primary" onClick={handleStart}>
              조리시작
            </Button>
          </Wrapper>
        </div>
      ) : (
        <div className={styles.steps}>
          <Wrapper>
            <h2>요리 순서</h2>
            {steps.length === 0 ? (
              <div>제공된 조리 순서가 없어요.</div>
            ) : (
              steps.map((s) => (
                <CookingStep
                  key={s.step}
                  stepNumber={s.step} // ✅ 이름 맞춰 전달
                  title={s.title}
                  description={s.desc}
                />
              ))
            )}
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving ? '처리 중…' : '조리완료'}
            </Button>
          </Wrapper>
        </div>
      )}

      <div className={styles.controlMargin}></div>
    </>
  );
}
