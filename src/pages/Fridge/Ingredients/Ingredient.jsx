import { useNavigate, useParams, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import styles from './Ingredient.module.css';
import EditSheet from './EditSheet';

export default function Ingredient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [ingredient, setIngredient] = useState({
    title: '계란',
    desc: '냉장 보관 시 최대 15일까지 보관 가능해요',
    quantity: 7,
    expire: '2025.00.00',
    location: '냉장실',
    memo: '계란밥 해먹기',
    imageSrc: '',
    remainingDays: 11,
  });

  useEffect(() => {
    if (location.state) {
      setIngredient(location.state);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
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
          {/* 이미지 or placeholder */}
          <div className={styles.image}>
            {ingredient.imageSrc ? (
              <img
                src={ingredient.imageSrc}
                alt={ingredient.title}
                className={styles.image}
              />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>

          {/* 제목 + D-11 + 삭제 */}
          <div className={styles.titleRow}>
            <span className={styles.name}>{ingredient.title}</span>
            <span className={styles.centerButtons}>
              <Button size="small" className={styles.ddayBtn}>
                D-{ingredient.remainingDays}
              </Button>
            </span>
            <Button size="small" variant="danger" className={styles.deleteBtn}>
              삭제
            </Button>
          </div>

          {/* 설명 */}
          <div className={styles.desc}>
            <p>{ingredient.desc}</p>
          </div>

          {/* 정보 영역 */}
          <div className={styles.infoSection}>
            <div className={styles.infoHeader}>
              <h3>정보</h3>
              <button className={styles.editBtn} onClick={handleEdit}>
                수정
              </button>

              {isEditOpen && (
                <>
                  <div onClick={closeEdit} />

                  <div className={styles.dragBar} />
                  <EditSheet onClose={closeEdit} data={ingredient} />
                </>
              )}
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

          {/* 메모 */}
          <div className={styles.memoSection}>
            <h3>메모</h3>
            <textarea
              className={styles.memoInput}
              value={ingredient.memo}
              onChange={(e) =>
                setIngredient({ ...ingredient, memo: e.target.value })
              }
              placeholder="메모를 입력하세요"
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
