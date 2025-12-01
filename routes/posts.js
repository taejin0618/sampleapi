const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
} = require("../data/posts");

/**
 * @swagger
 * /v1/api/posts:
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

    const result = getAllPosts(page, limit, writer);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v1/api/posts/{id}:
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
 * /v1/api/posts:
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
 *             required: [title, content]
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
 *                 description: "작성자 이름 (선택 사항, 기본값: 익명)"
 *                 example: "홍길동"
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
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "제목과 내용은 필수 입력 항목입니다.",
      });
    }

    const post = createPost(title, content, author);
    // 응답 형식을 기존과 호환되도록 변환
    const response = {
      id: post.id,
      subject: post.title,
      body: post.content,
      writer: post.author,
      createdDate: post.createdAt,
      updatedAt: post.updatedAt,
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v1/api/posts/{id}:
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
