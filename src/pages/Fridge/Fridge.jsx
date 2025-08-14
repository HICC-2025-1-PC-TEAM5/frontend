import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router';
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
import { getIngredients } from '../../lib/fridge';

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

export default function Fridge() {
  const navigate = useNavigate();

  // 정렬/데이터
  const [sortOption, setSortOption] = useState('latest');
  const [items, setItems] = useState([]);

  // 카테고리 상태 (UI는 그대로, 데이터만 필터)
  const [mainCat, setMainCat] = useState('all'); // all | fridge | freezer | room
  const [subCat, setSubCat] = useState('all');

  // 추천 섹션(원래 구조 유지용 간단 더미)
  const recommends = [
    { id: 'rec-1', imageSrc: '', text: '양파', variant: 'small' },
    { id: 'rec-2', imageSrc: '', text: '달걀', variant: 'small' },
    { id: 'rec-3', imageSrc: '', text: '우유', variant: 'small' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const userId = import.meta.env.VITE_DEV_USER_ID || '1';
        const data = await getIngredients(userId);

        // 배열로 오든 { refrigeratorIngredient: [] }로 오든 모두 처리
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
            imageSrc: img, // 빈 문자열 금지
            title: it.name,
            // 카드 하단 보조 텍스트(원본 구조 유지)
            desc: it.expire_date
              ? `유통기한 ${it.expire_date.slice(0, 10)}`
              : '',
            // 필터링용(렌더엔 직접 쓰지 않음)
            location: main, // 'fridge'|'freezer'|'room'
            subCategory: normalizeCategoryKo(main, it.category), // 하위 카테고리 id
          };
        });

        setItems(list);
      } catch (e) {
        console.error(e);
        alert('재료 불러오기 실패');
      }
    })();
  }, []);

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

    // (선택) 정렬
    if (sortOption === 'name') {
      base = [...base].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }
    // 'expire', 'latest' 등은 실제 필드가 필요하면 추가 구현

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

      {/* 추천 섹션(원래 클래스 유지) */}
      <div className={styles.recommands}>
        <div className={styles.message}>
          <p>이 재료들을 구비해보는 건 어떨까요?</p>
        </div>
        <Wrapper>
          <Stack gap="1rem" wrap="wrap">
            {recommends.map((r) => (
              <ImageCoin
                key={r.id}
                imageSrc={r.imageSrc}
                text={r.text}
                variant={r.variant}
              />
            ))}
          </Stack>
        </Wrapper>
      </div>

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
