import { useState } from 'react';
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

export default function Fridge() {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('latest');

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // 여기서 sortOption에 따라 items 정렬 로직 추가 가능
  };

  const suggestionItems = [
    { id: 1, imageSrc: '', text: '굴소스' },
    { id: 2, imageSrc: '', text: '액젓' },
    { id: 3, imageSrc: '', text: '면' },
    { id: 4, imageSrc: '', text: '숙주' },
  ];

  // 냉장고 보관 재료 데이터
  const items = [
    {
      id: 1,
      imageSrc: '',
      title: '두부',
      desc: '유통기한 2025-08-10',
    },
    {
      id: 2,
      imageSrc: '',
      title: '파',
      desc: '유통기한 2025-08-05',
    },
    { id: 3, imageSrc: '', title: '계란', desc: '유통기한 2025-08-20' },
  ];

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>식재료 관리</h1>
        <div className={styles.buttonGroup}>
          <Button variant="default">재료 추가</Button>
          <Button variant="default">재료 수정</Button>
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
        <OptionsInput
          label="정렬 기준"
          message=""
          error=""
          onChange={handleSortChange}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="expire">유통기한순</option>
        </OptionsInput>
      </div>

      <div className={styles.ingredients}>
        <Wrapper>
          <Stack className={styles.ingredientsIndex} rows="2" wrap="wrap">
            {items.map((item) => (
              <Link key={item.id} to={`/ingredients/${item.id}`}>
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
