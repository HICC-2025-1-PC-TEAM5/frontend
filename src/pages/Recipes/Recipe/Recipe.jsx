import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './Recipe.module.css';
import RecipeInfo from '../components/RecipeInfo';
import ImageCoin from '../../../components/ImageCoin';
import Button from '../../../components/Button';
import PeopleCounter from '../components/PeopleCounter';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import CookingStep from '../components/CookingStep';
// ✅ 조리완료 시 냉장고 재료 삭제
import { removeIngredient } from '../../../lib/fridge';

// 더미 데이터(현재 레시피 연결 전이므로 화면 확인용)
const ingredientsNo = [
  { id: 1, imageSrc: '', text: '굴소스', variant: 'medium' },
  { id: 2, imageSrc: '', text: '맛술', variant: 'medium' },
];
const ingredientsYes = [
  { id: 1, imageSrc: '', text: '냉동새우', variant: 'medium' },
  { id: 2, imageSrc: '', text: '파', variant: 'medium' },
  { id: 3, imageSrc: '', text: '즉석밥', variant: 'medium' },
  { id: 4, imageSrc: '', text: '계란', variant: 'medium' },
];

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  // 조리 시작/완료 상태
  const [showSteps, setShowSteps] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps = [
    { step: 1, title: '재료 손질', desc: '야채를 깨끗이 씻고 손질하세요.' },
    { step: 2, title: '볶기', desc: '중불에서 5분간 볶으세요.' },
    { step: 3, title: '마무리', desc: '간을 하고 불을 끕니다.' },
  ];

  // 조리 완료 시 사용할 재료 이름 목록(“있어요”만)
  const usedIngredientNames = useMemo(
    () => ingredientsYes.map((i) => i.text).filter(Boolean),
    []
  );

  const handleStart = () => setShowSteps(true);

  const handleComplete = async () => {
    try {
      setSaving(true);
      const userId = import.meta.env.VITE_DEV_USER_ID || '1';
      // ✅ 냉장고에서 사용 재료 삭제 (서버에서 /by-names 지원 or fallback으로 개별 삭제)
      await removeIngredientsByNames(userId, usedIngredientNames);
      navigate('/fridge');
    } catch (e) {
      console.error(e);
      alert('조리 완료 처리 중 오류가 발생했어요.');
    } finally {
      setSaving(false);
    }
  };

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
          <RecipeInfo id={id} />
        </Wrapper>
      </div>

      {/* 재료 섹션은 항상 보이게 유지(요구사항 스샷과 동일) */}
      <div className={styles.ingredients}>
        <Wrapper>
          <h2>재료</h2>

          <h4>없어요</h4>
          <Stack>
            {ingredientsNo.map((item) => (
              <ImageCoin
                key={item.id}
                imageSrc={item.imageSrc}
                text={item.text}
              />
            ))}
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

      {/* 하단: 조리 시작 전엔 SelectHeader 영역(=PeopleCounter), 시작 후엔 요리 순서 + 조리완료 */}
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
            {steps.map((s) => (
              <CookingStep
                key={s.step}
                stepNumber={s.step}
                title={s.title}
                description={s.desc}
              />
            ))}
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
