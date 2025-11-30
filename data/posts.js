// 메모리 저장소 - 게시글 데이터 관리
let posts = [];
let nextId = 1;

// 전체 게시글 조회
function getAllPosts() {
  return posts;
}

// ID로 게시글 조회
function getPostById(id) {
  return posts.find(post => post.id === parseInt(id));
}

// 게시글 생성
function createPost(subject, body, writer, tags = [], priority = 5, isPinned = false, status = 'active') {
  const now = new Date().toISOString();
  const post = {
    id: nextId++,
    subject,
    body,
    writer,
    tags: tags || [],
    priority: priority || 5,
    isPinned: isPinned || false,
    status,
    createdDate: now,
    updatedAt: now
  };
  posts.push(post);
  return post;
}

// 게시글 수정
function updatePost(id, subject, body, writer, tags, priority, isPinned, status) {
  const post = getPostById(id);
  if (!post) {
    return null;
  }

  if (subject !== undefined) post.subject = subject;
  if (body !== undefined) post.body = body;
  if (writer !== undefined) post.writer = writer;
  if (tags !== undefined) post.tags = tags;
  if (priority !== undefined) post.priority = priority;
  if (isPinned !== undefined) post.isPinned = isPinned;
  if (status !== undefined) post.status = status;
  post.updatedAt = new Date().toISOString();

  return post;
}

// 게시글 삭제
function deletePost(id) {
  const index = posts.findIndex(post => post.id === parseInt(id));
  if (index === -1) {
    return false;
  }
  posts.splice(index, 1);
  return true;
}

// 작성자별 게시글 조회
function getPostsByAuthor(writer) {
  return posts.filter(post => post.writer === writer);
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
};
