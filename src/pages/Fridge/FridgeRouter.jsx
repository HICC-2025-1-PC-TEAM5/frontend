import { Routes, Route } from 'react-router-dom';
import Fridge from './Fridge';
import Ingredient from './Ingredients/Ingredient';
import AddForm from './Ingredients/AddForm';
import CameraAdd from './Ingredients/CameraAdd';
import EditList from './Ingredients/EditList';

export default () => {
  return (
    <>
      <Routes>
        <Route index element={<Fridge />} />
        <Route path="ingredients/:id" element={<Ingredient />} />

        <Route path="ingredients/add" element={<AddForm />} />
        <Route path="ingredients/add/form" element={<AddForm />} />
        <Route path="ingredients/add/camera" element={<CameraAdd />} />
        <Route path="ingredients/edit" element={<EditList />} />
      </Routes>
    </>
  );
};
