import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import AuthStart from './pages/Auth/AuthStart';
import AuthLogin from './pages/Auth/AuthLogin';
import RecipesRouter from './pages/Recipes/RecipesRouter';
import FridgeRouter from './pages/Fridge/FridgeRouter';
import ProfileRouter from './pages/Profile/ProfileRouter';
import AuthCallback from './pages/Auth/AuthCallback';
import style from './App.module.css';
import ComponentsTest from './components/ComponentsTest';
import { SavedRecipesProvider } from './pages/Recipes/SavedRecipesContext';
import { UserProvider, useUser } from './pages/UserContext.jsx';
import RequireAuth from './routes/RequireAuth';

function Protected({ children }) {
  const { isAuthed } = useUser();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <UserProvider>
      <div className={style.field}>
        <div className={style.app} dem="demo">
          <div className={style.topMargin}></div>
          <div className={style.wrapper}>
            <SavedRecipesProvider>
              <Routes>
                {/* 공개 라우트 */}
                <Route path="login" element={<AuthLogin />} />
                <Route path="start" element={<AuthStart />} />
                <Route path="intro" element={<Intro />} />

                {/* 보호 라우트 */}
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route path="auth/callback" element={<AuthCallback />} />
                <Route
                  path="recipes/*"
                  element={
                    <RequireAuth>
                      <RecipesRouter />
                    </RequireAuth>
                  }
                />
                <Route
                  path="fridge/*"
                  element={
                    <RequireAuth>
                      <FridgeRouter />
                    </RequireAuth>
                  }
                />
                <Route
                  path="profile/*"
                  element={
                    <RequireAuth>
                      <ProfileRouter />
                    </RequireAuth>
                  }
                />

                {/* 테스트 페이지 */}
                <Route path="test/components" element={<ComponentsTest />} />

                {/* 그 외는 홈 */}
                <Route
                  path="*"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
              </Routes>
            </SavedRecipesProvider>
          </div>
          <div className={style.bottomMargin}></div>
        </div>
      </div>
    </UserProvider>
  );
}
