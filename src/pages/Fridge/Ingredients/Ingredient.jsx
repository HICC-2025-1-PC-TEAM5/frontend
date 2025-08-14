// src/pages/Fridge/Ingredients/Ingredient.jsx
import { useNavigate, useParams, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import EditSheet from './EditSheet';
import styles from './Ingredient.module.css';

import {
  patchFridgeQuantity,
  deleteFridgeIngredient,
  getIngredientDetail,
} from '../../../lib/fridge';

export default function Ingredient() {
  const navigate = useNavigate();
  const { id: ingredientIdParam } = useParams(); // URL의 :id (ingredientId로 사용)
  const location = useLocation();

  // 목록에서 넘어올 때 refrigeratorId를 state로 넘겼다면 사용
  const refrigeratorIdFromList = location.state?.refrigeratorId;

  const [ingredient, setIngredient] = useState({
    id: Number(ingredientIdParam), // ingredientId
    title: '계란',
    desc: '냉장 보관 시 최대 15일까지 보관 가능해요',
    quantity: 7,
    expire: '2025.00.00',
    location: '냉장실',
    memo: '계란밥 해먹기',
    imageSrc: '',
    remainingDays: 11,
    refrigeratorId: refrigeratorIdFromList, // 삭제/수정에 쓸 id (서버가 요구)
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  // 초기에 서버에서 단건 조회 (ingredientId 기준)
  useEffect(() => {
    const run = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        const data = await getIngredientDetail({
          userId,
          ingredientId: ingredientIdParam,
          token,
        });
        // 서버 응답 스키마 예시에 맞춰 매핑
        const ing = data?.ingredient;
        if (ing) {
          setIngredient((prev) => ({
            ...prev,
            id: ing.id,
            title: ing.name,
            quantity: Number(ing.quantity ?? prev.quantity),
            // unit, allergy 등은 필요 시 추가로 보관
          }));
        }
      } catch (e) {
        console.error(e);
        // 400/401/404/408 등 상황에 맞춰 UX 처리
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientIdParam]);

  const handleBack = () => navigate(-1);

  // 수량 수정 완료 → PATCH 호출
  const handleEditSubmit = async (form) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) throw new Error('로그인이 필요합니다.');

      // refrigeratorId 확보: state로 안 왔다면 목록/카드에서 함께 넘겨주세요.
      const refrigeratorId =
        ingredient.refrigeratorId ||
        refrigeratorIdFromList ||
        location.state?.id; // 프로젝트 상황에 맞게 결정

      if (!refrigeratorId) {
        alert('refrigeratorId가 없어 수정을 진행할 수 없습니다.');
        return;
      }

      await patchFridgeQuantity({
        userId,
        refrigeratorId,
        quantity: form.quantity, // EditSheet에서 변경된 수량
        token,
      });

      // 로컬 상태 동기화
      setIngredient((prev) => ({ ...prev, quantity: form.quantity }));
      setIsEditOpen(false);
      alert('수량이 업데이트됐어요.');
    } catch (err) {
      console.error(err);
      const s = err.status;
      if (s === 400) alert('잘못된 요청(400)');
      else if (s === 401) alert('로그인이 필요합니다(401)');
      else if (s === 404) alert('대상을 찾을 수 없습니다(404)');
      else if (s === 408) alert('요청 시간 초과(408)');
      else alert(err.message || '알 수 없는 오류');
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return;

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) throw new Error('로그인이 필요합니다.');

      const refrigeratorId =
        ingredient.refrigeratorId ||
        refrigeratorIdFromList ||
        location.state?.id;

      if (!refrigeratorId) {
        alert('refrigeratorId가 없어 삭제를 진행할 수 없습니다.');
        return;
      }

      await deleteFridgeIngredient({ userId, refrigeratorId, token });
      alert('삭제되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      const s = err.status;
      if (s === 400) alert('잘못된 요청(400)');
      else if (s === 401) alert('로그인이 필요합니다(401)');
      else if (s === 404) alert('대상을 찾을 수 없습니다(404)');
      else if (s === 408) alert('요청 시간 초과(408)');
      else alert(err.message || '알 수 없는 오류');
    }
  };

  return (
    <>
      {/* 상단 고정 헤더 */}
      <div className={styles.header}>
        <Wrapper fill="height">
          <Stack justify="space-between" align="center" fill="all" gap="none">
            <div className={styles.headerSide}>
              <Button variant="invisible" icon="only" onClick={handleBack}>
                X
              </Button>
            </div>
            <div className={styles.headerMain}>
              <p className={styles.headerTitle}>재료 보기</p>
            </div>
            <div className={styles.headerSide}></div>
          </Stack>
        </Wrapper>
      </div>

      <div className={styles.headerMargin}></div>

      {/* 본문 */}
      <Wrapper>
        <div className={styles.container}>
          {/* … (이미지/설명 등 기존 그대로) */}

          {/* 제목 + D-11 + 삭제 */}
          <div className={styles.titleRow}>
            <span className={styles.name}>{ingredient.title}</span>
            <span className={styles.centerButtons}>
              <Button size="small" className={styles.ddayBtn}>
                D-{ingredient.remainingDays}
              </Button>
            </span>

            {/* 삭제 버튼 → DELETE */}
            <Button
              size="small"
              variant="danger"
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              삭제
            </Button>
          </div>

          {/* 정보 영역 */}
          <div className={styles.infoSection}>
            <div className={styles.infoHeader}>
              <h3>정보</h3>
              {/* 수정 버튼 → 바텀시트 오픈 */}
              <button
                className={styles.editBtn}
                onClick={() => setIsEditOpen(true)}
              >
                수정
              </button>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>수량</span>
              <span className={styles.infoValue}>{ingredient.quantity}개</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>소비기한</span>
              <span className={styles.infoValue}>{ingredient.expire}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>보관위치</span>
              <span className={styles.infoValue}>{ingredient.location}</span>
            </div>
          </div>

          {/* 메모… (기존 그대로) */}
        </div>
      </Wrapper>

      {/* 수량 수정 바텀시트 연결 */}
      {isEditOpen && (
        <EditSheet
          open
          initial={{
            expire: ingredient.expire,
            location: ingredient.location,
            quantity: ingredient.quantity,
            unit: '개',
          }}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
}
