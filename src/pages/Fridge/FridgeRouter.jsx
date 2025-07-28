import { Routes, Route } from 'react-router';
import Fridge from './Fridge';
import Ingredient from './Ingredients/Ingredient';

export default () => {
  return (
    <>
      <Routes>
        <Route index element={<Fridge />} />
        <Route path="ingredients/:id" element={<Ingredient />} />
        <Route path="ingredients/add" element={<Fridge />} />
        <Route path="ingredients/add/form" element={<Fridge />} />
        <Route path="ingredients/add/camera" element={<Fridge />} />
      </Routes>
    </>
  );
};
