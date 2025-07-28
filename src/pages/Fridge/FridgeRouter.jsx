import { Routes, Route } from 'react-router';
import Fridge from './Fridge';

export default () => {
  return (
    <Routes>
      <Route index element={<Fridge />} />
      <Route path=":id" element={<Fridge />} />
    </Routes>
  );
};
