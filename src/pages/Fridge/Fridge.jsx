// src/pages/Fridge/Fridge.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button';
import OptionsInput from '../../components/OptionsInput';
import Nav from '../../components/Nav';
import ImageCoin from '../../components/ImageCoin';
import ImageCard from '../../components/ImageCard';
import CategorySelect from './components/CategorySelect';
import Wrapper from '../../components/Wrapper';
import Stack from '../../components/Stack';
import styles from './Fridge.module.css';
import PencilIcon from '../../assets/svg/Fridge/Pencil.svg?react';
import PlusIcon from '../../assets/svg/Fridge/Plus.svg?react';
import { getIngredients, getNecessaryIngredients } from '../../lib/fridge';
import { useUser } from '../UserContext';

/* =========================
   정규화 유틸 (서버 한글 → UI id)
   ========================= */
function normalizeLocationKo(type) {
  const v = String(type || '').trim();
  if (v.includes('냉장')) return 'fridge';
  if (v.includes('냉동')) return 'freezer';
  if (v.includes('실온') || v.toLowerCase().includes('normal')) return 'room';
  return 'fridge';
}
function normalizeCategoryKo(main, ko) {
  const v = String(ko || '').trim();
  if (main === 'fridge') {
    if (v === '채소') return 'vegetable';
    if (v === '과일') return 'fruit';
    if (v === '고기/해산물') return 'meat';
    if (v === '계란/유제품') return 'dairy';
    if (v === '양념/조미료') return 'condiment';
    return 'etc';
  }
  if (main === 'freezer') {
    if (v === '채소') return 'vegetable';
    if (v === '과일') return 'fruit';
    if (v === '고기/해산물') return 'meat';
    if (v === '가공식품') return 'processed';
    return 'etc';
  }
  // room
  if (v === '실온채소') return 'room-veg';
  if (v === '곡류/건조식품' || v === '곡류/전분류') return 'grain-dried';
  if (v === '조미료/향신료') return 'cond-spice';
  if (v === '가공식품') return 'processed';
  return 'etc';
}
const normName = (s) =>
  String(s || '')
    .trim()
    .toLowerCase();

export default function Fridge() {
  const navigate = useNavigate();
  // ✅ useUser() 올바른 사용: 컨텍스트에서 user 객체를 꺼내서 id 참조
  const { user, isAuthed } = useUser();
  const userIdFromCtx = user?.id;

  // 정렬/데이터
  const [sortOption, setSortOption] = useState('latest');
  const [items, setItems] = useState([]);

  // 카테고리 상태 (UI는 그대로, 데이터만 필터)
  const [mainCat, setMainCat] = useState('all'); // all | fridge | freezer | room
  const [subCat, setSubCat] = useState('all');

  // 필수 재료 추천(이미지코인)
  const [necessaryCoins, setNecessaryCoins] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const userId = userIdFromCtx || import.meta.env.VITE_DEV_USER_ID;
        if (!userId) return; // 유저 준비 전엔 호출 안 함

        // 1) 현재 냉장고 재료 불러오기
        const data = await getIngredients(userId);
        const raw = Array.isArray(data)
          ? data
          : (data?.refrigeratorIngredient ?? []);

        const list = raw.map((it) => {
          const main = normalizeLocationKo(it.type);
          const img =
            it.imageUrl ||
            it.image ||
            it.imageSrc ||
            it.thumbnail ||
            it.thumbnailUrl ||
            `https://picsum.photos/seed/${encodeURIComponent(it.name || it.id)}/600/400`;

          return {
            id: it.id,
            imageSrc: img,
            title: it.name,
            desc: it.expire_date
              ? `유통기한 ${it.expire_date.slice(0, 10)}`
              : '',
            location: main, // 'fridge'|'freezer'|'room'
            subCategory: normalizeCategoryKo(main, it.category),
          };
        });
        if (!ignore) setItems(list);

        // 2) 필수 재료 추천에서 "내 냉장고에 없는" 것만 걸러 코인으로 사용
        const ownedNames = new Set(list.map((it) => normName(it.title)));
        const necessary = await getNecessaryIngredients(userId); // 서버: { ingredientList: [...] } -> 함수에서 배열로 반환됨
        const missing = (necessary || []).filter(
          (n) => !ownedNames.has(normName(n.name))
        );

        // UI용 코인 데이터로 매핑 (클릭 불필요)
        const coins = missing.slice(0, 8).map((n) => ({
          id: n.id,
          imageSrc: n.imageUrl || '',
          text: n.name,
          variant: 'small',
          allergy: !!n.allergy,
        }));
        if (!ignore) setNecessaryCoins(coins);
      } catch (e) {
        console.error(e);
        alert('재료 불러오기 실패');
      }
    })();
    return () => {
      ignore = true;
    };
  }, [userIdFromCtx]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // TODO: 정렬 로직 필요 시 여기서 처리
  };

  // ❗DOM/클래스는 유지, map에 들어갈 "데이터만" 필터링
  const filteredItems = useMemo(() => {
    let base = items.filter((it) => {
      if (mainCat !== 'all' && it.location !== mainCat) return false;
      if (subCat !== 'all' && it.subCategory !== subCat) return false;
      return true;
    });

    if (sortOption === 'name') {
      base = [...base].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }
    return base;
  }, [items, mainCat, subCat, sortOption]);

  return (
    <>
      {/* 헤더(원래 구조/클래스 그대로) */}
      <div className={styles.header}>
        <h1 className={styles.title}>식재료 관리</h1>
        <div className={styles.buttonGroup}>
          <Button
            variant="invisible"
            className={styles.iconBtn}
            onClick={() => navigate('/fridge/ingredients/add')}
          >
            <span className={styles.icon}>
              <PlusIcon />
            </span>
            <span className={styles.iconLabel}>재료 추가</span>
          </Button>

          <Button
            variant="invisible"
            className={styles.iconBtn}
            onClick={() => navigate('/fridge/ingredients/edit')}
          >
            <span className={styles.icon}>
              <PencilIcon />
            </span>
            <span className={styles.iconLabel}>재료 수정</span>
          </Button>
        </div>
      </div>

      {/* 추천 섹션: 필요한 재료(내 냉장고에 없는 것만) 이미지코인 - 클릭 없음 */}
      {necessaryCoins.length > 0 && (
        <div className={styles.recommands}>
          <div className={styles.message}>
            <p>이 재료들을 구비해보는 건 어떨까요?</p>
          </div>
          <Wrapper>
            <Stack gap="1rem" wrap="wrap">
              {necessaryCoins.map((r) => (
                <div key={r.id}>
                  <ImageCoin
                    imageSrc={r.imageSrc}
                    text={r.text}
                    variant={r.variant}
                    titleAttr={r.allergy ? '알레르기 주의' : undefined}
                  />
                </div>
              ))}
            </Stack>
          </Wrapper>
        </div>
      )}

      {/* 카테고리(마크업 그대로, 값/이벤트만 연결) */}
      <CategorySelect
        mainSelected={mainCat}
        subSelected={subCat}
        onChangeMain={(id) => {
          setMainCat(id);
          setSubCat('all');
        }}
        onChangeSub={setSubCat}
      />

      {/* 정렬(원래 구조/클래스 그대로) */}
      <div className={styles.sort}>
        <OptionsInput message="" error="" onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="expire">유통기한순</option>
          <option value="name">이름순</option>
        </OptionsInput>
      </div>

      {/* 재료 그리드(원래 Wrapper/Stack/클래스 유지) */}
      <div className={styles.ingredients}>
        <Wrapper>
          <Stack className={styles.ingredientsIndex} rows="2" wrap="wrap">
            {filteredItems.map((item) => (
              <Link key={item.id} to={`/fridge/ingredients/${item.id}`}>
                <ImageCard
                  imageSrc={item.imageSrc}
                  title={item.title}
                  desc={item.desc}
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
