import { useEffect, useMemo, useState } from 'react';
import styles from './PreferenceInfo.module.css';
import Button from '../../../components/Button';
import LikeIcon from '../../../assets/svg/Profile/like.svg?react';
import DislikeIcon from '../../../assets/svg/Profile/dislike.svg?react';
import AllergyIcon from '../../../assets/svg/Profile/allergy.svg?react';
import PencilIcon from '../../../assets/svg/Profile/pencil.svg?react';
import EditSheet from './EditSheet';

// 서버: 알레르기 / 클라: 재료 취향
import {
  getAllergies,
  removeAllergy,
  getIngredientPrefs,
  saveIngredientPrefs,
} from '../../../lib/preference';

// UserContext 에서 로그인 사용자
import { useUser } from '../../UserContext';

export default function PreferenceInfo() {
  const { id: userId } = useUser() || {};

  // 재료 기반 좋아요/싫어요 (로컬)
  const [{ likeIngredients, dislikeIngredients }, setIngredientPrefs] =
    useState({
      likeIngredients: [],
      dislikeIngredients: [],
    });

  // 화면 표시용
  const likes = likeIngredients;
  const dislikes = dislikeIngredients;

  // 알레르기(서버)
  const [allergyList, setAllergyList] = useState([]); // [{ allergyId, name }]
  const allergyNames = useMemo(
    () => allergyList.map((a) => a.name),
    [allergyList]
  );

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // 최초 로드: 재료 취향(로컬) + 알레르기(서버)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const prefs = getIngredientPrefs();
        setIngredientPrefs(prefs);

        if (userId) {
          const allergies = await getAllergies(userId);
          setAllergyList(allergies || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // EditSheet 저장
  const handleSubmit = async ({ likes: L, dislikes: D, allergies: A }) => {
    // 1) 재료 취향 저장(로컬)
    const nextPrefs = { likeIngredients: L, dislikeIngredients: D };
    saveIngredientPrefs(nextPrefs);
    setIngredientPrefs(nextPrefs);

    // 2) 알레르기 동기화(서버: 삭제만 즉시, 추가는 ingredientId 필요 시 보류)
    const prevAllergyNames = new Set(allergyList.map((a) => a.name));
    const nextAllergyNames = new Set(A);

    // 삭제
    const toDelete = allergyList.filter((a) => !nextAllergyNames.has(a.name));
    if (userId && toDelete.length) {
      await Promise.allSettled(
        toDelete.map((a) => removeAllergy(userId, a.allergyId))
      );
    }

    // 추가(현재는 이름만 → ingredientId 선택 UI 생기면 addAllergy 사용)
    const added = [...nextAllergyNames].filter((n) => !prevAllergyNames.has(n));
    if (added.length) {
      console.warn('추가된 알레르기(ingredientId 필요):', added);
    }

    // 화면 상태 갱신
    const kept = allergyList.filter((a) => nextAllergyNames.has(a.name));
    const newly = added.map((name, i) => ({
      allergyId: `temp-${Date.now()}-${i}`,
      name,
    }));
    setAllergyList([...kept, ...newly]);

    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>요리 취향 정보</h2>
        <Button variant="invisible" size="small" onClick={() => setOpen(true)}>
          <span className={styles.srOnly}>취향 수정</span>
          <span className={styles.iconBtnBox}>
            <PencilIcon className={styles.editIcon} />
          </span>
        </Button>
      </div>

      <p className={styles.description}>
        입맛에 딱 맞는 요리를 추천받을 수 있어요.
      </p>

      {/* 좋아요(재료) */}
      <div className={styles.section}>
        <span className={styles.label}>
          <LikeIcon className={styles.icon} /> 좋아요 재료
        </span>
        <div className={styles.buttonGroup}>
          {loading ? (
            <span className={styles.empty}>불러오는 중…</span>
          ) : likes.length === 0 ? (
            <span className={styles.empty}>없음</span>
          ) : (
            likes.map((name) => (
              <Button key={name} size="small">
                {name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* 싫어요(재료) */}
      <div className={styles.section}>
        <span className={styles.label}>
          <DislikeIcon className={styles.icon} /> 싫어요 재료
        </span>
        <div className={styles.buttonGroup}>
          {loading ? (
            <span className={styles.empty}>불러오는 중…</span>
          ) : dislikes.length === 0 ? (
            <span className={styles.empty}>없음</span>
          ) : (
            dislikes.map((name) => (
              <Button key={name} size="small">
                {name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* 알레르기(서버) */}
      <div className={styles.section}>
        <span className={styles.label}>
          <AllergyIcon className={styles.icon} /> 알레르기
        </span>
        <div className={styles.buttonGroup}>
          {loading ? (
            <span className={styles.empty}>불러오는 중…</span>
          ) : allergyNames.length === 0 ? (
            <span className={styles.empty}>없음</span>
          ) : (
            allergyNames.map((name) => (
              <Button key={name} size="small">
                {name}
              </Button>
            ))
          )}
        </div>
      </div>

      <EditSheet
        open={open}
        initial={{ likes, dislikes, allergies: allergyNames }}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
