import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import AuthStart from './pages/Auth/AuthStart';
import AuthLogin from './pages/Auth/AuthLogin';
import RecipesRouter from './pages/Recipes/RecipesRouter';
import FridgeRouter from './pages/Fridge/FridgeRouter';
import ProfileRouter from './pages/Profile/ProfileRouter';
import SettingsRouter from './pages/Settings/SettingsRouter';

import style from './App.module.css';
import ComponentsTest from './components/ComponentsTest';

/*

/ >> 메인

/start >> 시작하기 (회완가입)
/login >> 로그인 

/recipes >> 레시피 목록 (전체 카테고리)
/recipes?category="카테고리" >> 특정 카테고리의 레시피 목록
/recipes?search="검색어" >> 검색한 레시피 목록
/recipes/:rid >> 특정 레시피 (인분 선택)
/recipes/:rid/cooking >> 레시피 조리 과정 (조리 시작)
/recipes/:rid/complete >> 조리 완료 후 사용된 제료 삭제

/fridge >> 냉장고, 재료들을 보여줌
/fridge/ingredients/:iid
/fridge/add >> 재료 추가 방법 선택
/fridge/add/form >> 재료 추가 (직접 입력)
/fridge/add/camera >> 재료 추가 (카메라, 재료 직접 촬영)
/fridge/add/camera-receipt >> 재료 추가 (카메라, 영수증, 바코드 촬영)

/profile >> 마이페이지

/settings/profile >> 마이페이지 설정

*/

const session = {
  cookie: {
    name: 'session',
  },
};

export default () => {
  let routes;
  if (true) {
    routes = (
      <>
        <Route index element={<Home />} />
        <Route path="recipes/*" element={<RecipesRouter />} />
        <Route path="fridge/*" element={<FridgeRouter />} />
        <Route path="profile/*" element={<ProfileRouter />} />
        <Route path="settings/*" element={<SettingsRouter />} />
        <Route path="test/components" element={<ComponentsTest />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route index element={<Intro />} />
        <Route path="start" element={<AuthStart />} />
        <Route path="login" element={<AuthLogin />} />
      </>
    );
  }

  return (
    <div className={style.app}>
      <div className={style.wrapper}>
        <BrowserRouter>
          <Routes>{routes}</Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};
