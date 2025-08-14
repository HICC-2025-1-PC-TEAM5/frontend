import { useEffect, useState } from 'react';
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

export default function Fridge() {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('latest');
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const userId = import.meta.env.VITE_DEV_USER_ID || '1'; // ← 세미콜론!
        const data = await getIngredients(userId);
        const list = (data?.refrigeratorIngredient || []).map((it) => ({
          id: it.id,
          imageSrc: '',
          title: it.name,
          desc: it.expire_date ? `유통기한 ${it.expire_date.slice(0, 10)}` : '',
        }));
        setItems(list);
      } catch (e) {
        console.error(e);
        alert('재료 불러오기 실패');
      }
    })();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // TODO: sortOption에 따라 items 정렬
  };

  const suggestionItems = [
    { id: 1, imageSrc: '', text: '굴소스' },
    { id: 2, imageSrc: '', text: '액젓' },
    { id: 3, imageSrc: '', text: '면' },
    { id: 4, imageSrc: '', text: '숙주' },
  ];

  return (
    <>
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

          <Button variant="invisible" className={styles.iconBtn}>
            <span className={styles.icon}>
              <PencilIcon />
            </span>
            <span className={styles.iconLabel}>재료 수정</span>
          </Button>
        </div>
      </div>

      <div className={styles.recommands}>
        <div className={styles.message}>
          <p>이 재료들을 구비해보는 건 어떨까요?</p>
        </div>
        <div className={styles.imageList}>
          {suggestionItems.map((item) => (
            <ImageCoin
              key={item.id}
              imageSrc={item.imageSrc}
              text={item.text}
              variant="medium"
            />
          ))}
        </div>
        <Button variant="default" className={styles.actionButton}>
          조금만 넣어도 깊은 맛이 확 살아나요
        </Button>
      </div>

      <CategorySelect />

      <div className={styles.sort}>
        <OptionsInput message="" error="" onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="expire">유통기한순</option>
        </OptionsInput>
      </div>

      <div className={styles.ingredients}>
        <Wrapper>
          <Stack className={styles.ingredientsIndex} rows="2" wrap="wrap">
            {items.map((item) => (
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
