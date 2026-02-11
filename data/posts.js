// 메모리 저장소 - 게시글 데이터 관리
let posts = [];
let nextId = 1;

// 전체 게시글 조회
function getAllPosts(page = 1, limit = 10, writer = null, includePrivate = false) {
  let filteredPosts = posts;

  // isPublic 필터링
  if (!includePrivate) {
    filteredPosts = filteredPosts.filter((post) => post.isPublic === true);
  }

  // 작성자 필터링
  if (writer) {
    filteredPosts = filteredPosts.filter((post) => post.author === writer);
  }

  // 페이지네이션
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 변환 없이 원본 반환
  return {
    data: paginatedPosts,
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
  // 변환 없이 원본 반환
  return post;
}

// 게시글 생성
function createPost(title, content, author, isPublic = true) {
  const now = new Date().toISOString();
  const post = {
    id: nextId++,
    title,
    content,
    author,
    viewCount: 0,
    isPublic,
    createdAt: now,
    updatedAt: now,
  };
  posts.push(post);
  return post;
}

// 게시글 수정
function updatePost(id, title, content, author, isPublic) {
  const post = posts.find((post) => post.id === parseInt(id));
  if (!post) {
    return null;
  }

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (author !== undefined) post.author = author;
  if (isPublic !== undefined) post.isPublic = isPublic;
  post.updatedAt = new Date().toISOString();

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
  updatePost,
  deletePost,
};
