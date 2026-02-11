// 메모리 저장소 - 테스트 데이터 관리
let tests = [];
let nextId = 1;

// 전체 테스트 항목 조회
function getAllTests(page = 1) {
  // 페이지네이션
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + 10;
  const paginatedTests = tests.slice(startIndex, endIndex);

  return paginatedTests;
}

// ID로 테스트 항목 조회
function getTestById(id) {
  const test = tests.find((test) => test.id === parseInt(id));
  if (!test) {
    return null;
  }
  return test;
}

// 테스트 항목 생성
function createTest(name, value) {
  const now = new Date().toISOString();
  const test = {
    id: nextId++,
    name,
    value,
    createdAt: now,
    updatedAt: now,
  };
  tests.push(test);
  return test;
}

// 테스트 항목 수정
function updateTest(id, name, value) {
  const test = tests.find((test) => test.id === parseInt(id));
  if (!test) {
    return null;
  }

  if (name !== undefined) test.name = name;
  if (value !== undefined) test.value = value;
  test.updatedAt = new Date().toISOString();

  return test;
}

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
};
