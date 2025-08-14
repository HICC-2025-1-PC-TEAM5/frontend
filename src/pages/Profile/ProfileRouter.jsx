import { Routes, Route } from 'react-router';
import Profile from './Profile';
import SettingsRouter from './Settings/SettingsRouter';

export default () => {
  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route path="settings/*" element={<SettingsRouter />} />
    </Routes>
  );
};
