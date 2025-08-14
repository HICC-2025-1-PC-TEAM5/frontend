import { useEffect, useMemo, useState } from 'react';
import styles from './PreferenceInfo.module.css';
import Button from '../../../components/Button';
import LikeIcon from '../../../assets/svg/Profile/like.svg?react';
import DislikeIcon from '../../../assets/svg/Profile/dislike.svg?react';
import AllergyIcon from '../../../assets/svg/Profile/allergy.svg?react';
import PencilIcon from '../../../assets/svg/Profile/pencil.svg?react';
import EditSheet from './EditSheet';

// ✅ 알레르기 API 유틸
import {
  getAllergies,
  removeAllergy /*, addAllergy */,
} from '../../../lib/preference';

export default function PreferenceInfo() {
  // 👉 실제 로그인 사용자 id로 교체하세요. (예: auth context)
  const userId = import.meta.env.VITE_DEV_USER_ID;

  const [likes, setLikes] = useState(['한식', '중식']);
  const [dislikes, setDislikes] = useState(['오이', '파래']);

  // ✅ 알레르기는 백엔드와 연동(객체 목록: {allergyId, name, ...})
  const [allergyList, setAllergyList] = useState([]); // 서버 원본
  const allergyNames = useMemo(
    () => allergyList.map((a) => a.name),
    [allergyList]
  );

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // 최초 로드 시 서버에서 알레르기 목록 불러오기
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getAllergies(userId); // [{allergyId, name, ...}]
        setAllergyList(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // EditSheet 저장 시: 삭제된 알러지만 서버에 즉시 반영
  const handleSubmit = async ({ likes: L, dislikes: D, allergies: A }) => {
    setLikes(L);
    setDislikes(D);

    // 서버의 기존 알러지 이름 집합
    const prevNames = new Set(allergyList.map((a) => a.name));
    const nextNames = new Set(A);

    // 1) 삭제: 이전에는 있었는데 지금은 없는 이름 → allergyId로 DELETE
    const toDelete = allergyList.filter((a) => !nextNames.has(a.name));
    if (toDelete.length) {
      await Promise.allSettled(
        toDelete.map((a) => removeAllergy(userId, a.allergyId))
      );
    }

    // 2) 추가: 지금은 있는데 이전엔 없던 이름들 (ingredientId 필요 → 일단 로컬로만 유지)
    const addedNames = [...nextNames].filter((n) => !prevNames.has(n));
    if (addedNames.length) {
      // TODO: 여기서 이름→ingredientId 매핑 UI/엔드포인트가 준비되면 addAllergy(userId, ingredientId) 호출
      // ex) await addAllergy(userId, ingredientId);
      console.warn('추가된 알레르기(로컬만 반영):', addedNames);
    }

    // 최종적으로 화면 상태를 next로 맞춤
    // (삭제 반영된 서버 상태를 다시 fetch 해도 되고, 로컬 계산으로 갱신해도 됨)
    const kept = allergyList.filter((a) => nextNames.has(a.name));
    const newly = addedNames.map((name, i) => ({
      // 임시 로컬 id (서버 저장 전)
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

      <div className={styles.section}>
        <span className={styles.label}>
          <LikeIcon className={styles.icon} />
          좋아요
        </span>
        <div className={styles.buttonGroup}>
          {likes.length === 0 ? (
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

      <div className={styles.section}>
        <span className={styles.label}>
          <DislikeIcon className={styles.icon} />
          싫어요
        </span>
        <div className={styles.buttonGroup}>
          {dislikes.length === 0 ? (
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

      <div className={styles.section}>
        <span className={styles.label}>
          <AllergyIcon className={styles.icon} />
          알레르기
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
