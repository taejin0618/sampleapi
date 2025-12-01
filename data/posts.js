// 메모리 저장소 - 게시글 데이터 관리
let posts = [];
let nextId = 1;

// 전체 게시글 조회
function getAllPosts(page = 1, limit = 10, writer = null) {
  let filteredPosts = posts;

  // 작성자 필터링
  if (writer) {
    filteredPosts = filteredPosts.filter((post) => post.author === writer);
  }

  // 페이지네이션
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 응답 형식을 기존과 호환되도록 변환
  const mappedPosts = paginatedPosts.map((post) => ({
    id: post.id,
    subject: post.title,
    body: post.content,
    writer: post.author,
    createdDate: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return {
    data: mappedPosts,
    pagination: {
      page,
      limit,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
    },
  };
}

// ID로 게시글 조회
function getPostById(id) {
  const post = posts.find((post) => post.id === parseInt(id));
  if (!post) {
    return null;
  }
  // 기존 필드명과 호환성을 위해 매핑
  return {
    id: post.id,
    subject: post.title,
    body: post.content,
    writer: post.author,
    createdDate: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

// 게시글 생성
function createPost(title, content, author = "익명") {
  const now = new Date().toISOString();
  const post = {
    id: nextId++,
    title,
    content,
    author,
    createdAt: now,
    updatedAt: now,
  };
  posts.push(post);
  return post;
}

// 게시글 삭제
function deletePost(id) {
  const index = posts.findIndex((post) => post.id === parseInt(id));
  if (index === -1) {
    return false;
  }
  posts.splice(index, 1);
  return true;
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
};
