const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../data/posts");

/**
 * @swagger
 * /v3/api/posts:
 *   get:
 *     operationId: getAllPosts
 *     summary: 전체 게시글 목록 조회
 *     description: 시스템에 등록된 모든 게시글의 목록을 조회합니다. 페이지네이션 및 작성자 필터링을 지원합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 게시글 수
 *       - in: query
 *         name: writer
 *         schema:
 *           type: string
 *         description: 작성자로 필터링 (선택 사항)
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const writer = req.query.writer || null;
    const includePrivate = false;

    const result = getAllPosts(page, limit, writer, includePrivate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v3/api/posts/{id}:
 *   get:
 *     operationId: getPostById
 *     summary: 특정 게시글 조회
 *     description: 지정된 ID의 게시글 상세 정보를 조회합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req, res) => {
  try {
    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v3/api/posts:
 *   post:
 *     operationId: createPost
 *     summary: 게시글 생성
 *     description: 새로운 게시글을 생성합니다.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, author]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *                 example: "새로운 게시글 제목"
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *                 example: "게시글 내용입니다."
 *               author:
 *                 type: string
 *                 description: 작성자 이름 (필수)
 *                 example: "홍길동"
 *               viewCount:
 *                 type: integer
 *                 description: 조회수 (무시됨, 서버에서 항상 0으로 초기화)
 *                 example: 0
 *               isPublic:
 *                 type: boolean
 *                 description: 공개 여부 (기본값 true)
 *                 example: true
 *           examples:
 *             case1:
 *               summary: "필수 필드만"
 *               value:
 *                 title: "첫 게시글"
 *                 content: "내용"
 *                 author: "홍길동"
 *             case2:
 *               summary: "모든 필드"
 *               value:
 *                 title: "공개 게시글"
 *                 content: "모두 공개"
 *                 author: "김철수"
 *                 isPublic: true
 *             case3:
 *               summary: "비공개 게시글"
 *               value:
 *                 title: "비공개"
 *                 content: "목록에 안보임"
 *                 author: "이영희"
 *                 isPublic: false
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", (req, res) => {
  try {
    const { title, content, author, isPublic } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        message: "제목, 내용, 작성자는 필수 입력 항목입니다.",
      });
    }

    const post = createPost(title, content, author, isPublic);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v3/api/posts/{id}:
 *   put:
 *     operationId: updatePost
 *     summary: 게시글 수정
 *     description: 기존 게시글의 정보를 수정합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, author]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *                 example: "수정된 게시글 제목"
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *                 example: "수정된 게시글 내용입니다."
 *               author:
 *                 type: string
 *                 description: 작성자 이름
 *                 example: "홍길동"
 *               isPublic:
 *                 type: boolean
 *                 description: 공개 여부
 *                 example: true
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", (req, res) => {
  try {
    const { title, content, author, isPublic } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        message: "제목, 내용, 작성자는 필수 입력 항목입니다.",
      });
    }

    const post = updatePost(req.params.id, title, content, author, isPublic);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v3/api/posts/{id}:
 *   delete:
 *     operationId: deletePost
 *     summary: 게시글 삭제
 *     description: 지정된 ID의 게시글을 삭제합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 삭제되었습니다.
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", (req, res) => {
  try {
    const deleted = deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
