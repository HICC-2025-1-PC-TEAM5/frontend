// src/pages/Fridge/Ingredients/AddIngredient.jsx
import { useState } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';
import styles from "./Add.module.css";

export default function AddIngredient() {
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  // 새 재료 추가
  const handleAdd = () => {
    setIngredients([
      ...ingredients,
      { name: '', quantity: 1, unit: '개', type: '실온', input_date: new Date().toISOString() },
    ]);
  };

  // 입력값 변경
  const handleChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // 수량 증가/감소
  const handleQuantity = (index, delta) => {
    const updated = [...ingredients];
    const newQty = updated[index].quantity + delta;
    updated[index].quantity = newQty < 1 ? 1 : newQty;
    setIngredients(updated);
  };

  // 삭제
  const handleRemove = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // 제출
  const handleSubmit = async () => {
    if (!user?.id || !token) return alert('로그인이 필요합니다.');
    if (ingredients.length === 0) return alert('재료를 추가하세요.');

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/users/${user.id}/fridge/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refrigeratorIngredient: ingredients }),
      });
      if (!res.ok) throw new Error(`등록 실패: ${res.status}`);
      const data = await res.json();
      alert(data.message || '등록 완료');
      setIngredients([]);
    } catch (err) {
      console.error(err);
      alert(err.message || '오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>재료 직접 입력</h2>
      <p>재료를 직접 입력하여 추가해주세요</p>

      <div className={styles.list}>
        {ingredients.map((item, index) => (
          <div key={index} className={styles.row}>
            <input
              type="text"
              placeholder="재료 이름"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <div className={styles.quantity}>
              <button type="button" onClick={() => handleQuantity(index, -1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => handleQuantity(index, 1)}>+</button>
            </div>
            <select
              value={item.unit}
              onChange={(e) => handleChange(index, 'unit', e.target.value)}
            >
              <option value="개">개</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="묶음">묶음</option>
            </select>
            <select
              value={item.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
            >
              <option value="실온">실온</option>
              <option value="냉장고">냉장고</option>
              <option value="냉동고">냉동고</option>
            </select>
            <Button type="button" onClick={() => handleRemove(index)}>삭제</Button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={handleAdd}>재료 추가</Button>
        <Button type="button" variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? '등록 중…' : '완료'}
        </Button>
      </div>
    </div>
  );
}
