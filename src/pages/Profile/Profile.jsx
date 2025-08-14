// src/pages/Profile/Profile.jsx
import { Link, useNavigate } from 'react-router';
import styles from './Profile.module.css';
import Button from '../../components/Button';
import Nav from '../../components/Nav';
import PreferenceInfo from './components/PreferenceInfo';
import ImageCard from '../../components/ImageCard';
import Stack from '../../components/Stack';
import Wrapper from '../../components/Wrapper';
import ProfileHeader from './components/ProfileHeader';
import { useSavedRecipes } from '../Recipes/SavedRecipesContext';

export default function Profile() {
  const navigate = useNavigate();
  const { list: savedList = [] } = useSavedRecipes();
  const handleCardClick = (rid) => navigate(`/recipes/${rid}`);

  const normalized = savedList.map((it) => ({
    id: it.id ?? it.rid ?? it.recipeId,
    title: it.title ?? it.name ?? '',
    imageSrc: it.imageSrc ?? it.image ?? it?.thumbnail?.Url ?? '',
    variant: 'large',
  }));

  return (
    <>
      <div className={styles.container}>
        <Wrapper>
          <Stack
            className={styles.header}
            justify="space-between"
            align="center"
            fill="width"
          >
            <Stack className={styles.headerProfile} align="center" gap="narrow">
              {/* ✅ 컨텍스트에서 username/사진 모두 읽음 */}
              <ProfileHeader />

              <Stack gap="narrow">
                <Button size="small">20대</Button>
                <Button size="small">자취</Button>
                <Button size="small">1인 가구</Button>
              </Stack>
            </Stack>

            <div className={styles.headerSettings}>
              <Link to="/profile/settings">
                <Button>설정</Button>
              </Link>
            </div>
          </Stack>

          <PreferenceInfo />

          <h3 className={styles.recommendTitle}>저장한 요리</h3>
          <div className={styles.content}>
            {normalized.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', color: 'var(--color-tone-8)' }}>
                아직 저장한 레시피가 없습니다
              </p>
            ) : (
              normalized.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(item.id)}
                  className={styles.cardWrapper}
                  style={{ all: 'unset', cursor: 'pointer' }}
                >
                  <ImageCard
                    imageSrc={item.imageSrc}
                    text={item.title}
                    variant={item.variant}
                  />
                </button>
              ))
            )}
          </div>
        </Wrapper>
      </div>

      <Nav />
    </>
  );
}
