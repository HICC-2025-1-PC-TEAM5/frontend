// src/mocks/handlers.js
import { http, HttpResponse, delay } from 'msw';

const API = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const hosts = [
  API, // .env에 지정한 주소 (예: https://localhost:8080)
 // 'https://localhost:8080',
  'http://localhost:8080',
  location.origin, // 같은 오리진(/api/.. 로 부르는 경우)
].filter(Boolean);

const db = {
  ingredients: [
    {
      id: 1,
      name: '계란',
      quantity: 10,
      unit: '개',
      location: '냉장실',
      expire_date: '2025-08-20',
      image: 'https://picsum.photos/seed/egg/600/400', // ← 임의 이미지
    },
    {
      id: 2,
      name: '오이',
      quantity: 1,
      unit: '개',
      location: '실온',
      expire_date: '2025-08-18',
      image: 'https://picsum.photos/seed/cucumber/600/400',
    },
    {
      id: 3,
      name: '우유',
      quantity: 1,
      unit: '팩',
      location: '냉장실',
      expire_date: '2025-08-15',
      image: 'https://picsum.photos/seed/milk/600/400',
    },
  ],
  preference: {
    likes: ['한식', '양식'],
    dislikes: ['오이', '파래'],
    allergies: ['땅콩', '게'],
  },
};

export const handlers = [];

// (선택) 헬스체크
handlers.push(http.get('/__health', () => HttpResponse.text('ok')));

// 네가 쓰는 모든 호스트에 동일 엔드포인트 등록
for (const origin of hosts) {
  handlers.push(
    http.get(`${origin}/api/users/:userId/fridge/ingredients`, async () => {
      await delay(200);
      return HttpResponse.json(db.ingredients);
    }),
    http.post(
      `${origin}/api/users/:userId/fridge/ingredients`,
      async ({ request }) => {
        const body = await request.json();
        const arr = body?.refrigeratorIngredient ?? [];
        arr.forEach((it) =>
          db.ingredients.push({ id: crypto.randomUUID(), ...it })
        );
        return HttpResponse.json({ ok: true });
      }
    )
  );
}
