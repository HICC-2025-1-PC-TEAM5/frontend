// src/lib/userStorage.js — 계정별 로컬 캐시 (D-036)
// 같은 브라우저에서 계정을 바꿔도 섞이지 않도록 키에 사용자 id를 붙인다: `${baseKey}:${userId}`
// D-036 이전에는 계정 구분 없는 `${baseKey}`에 저장했다. 처음 읽는 계정으로 옮기고 지운다
// 토큰·개인정보는 여기에 넣지 않는다

const keyOf = (baseKey, userId) => `${baseKey}:${userId}`;

/** 계정별 값을 읽는다. 없으면 null. userId가 없으면(로그인 전) 읽지 않는다 */
export function readUserItem(baseKey, userId) {
  if (!userId) return null;
  try {
    const key = keyOf(baseKey, userId);
    let raw = localStorage.getItem(key);
    if (raw == null) {
      const legacy = localStorage.getItem(baseKey);
      if (legacy != null) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(baseKey);
        raw = legacy;
      }
    }
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

/** 계정별 값을 쓴다. userId가 없으면 쓰지 않는다 */
export function writeUserItem(baseKey, userId, value) {
  if (!userId) return;
  try {
    localStorage.setItem(keyOf(baseKey, userId), JSON.stringify(value));
  } catch {
    // 저장소를 쓸 수 없는 환경이면 이번 화면에서만 유지된다
  }
}
