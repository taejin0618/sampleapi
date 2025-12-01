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
 * /v1/api/posts:
 *   get:
 *     operationId: getAllPosts
 *     summary: 전체 게시글 목록 조회
 *     description: 시스템에 등록된 모든 게시글의 목록을 조회합니다.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", (req, res) => {
  try {
    const posts = getAllPosts();
    res.json(posts);
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
 *             required: [subject, body]
 *             properties:
 *               subject:
 *                 type: string
 *                 description: 게시글 제목
 *                 example: "새로운 게시글 제목"
 *               body:
 *                 type: string
 *                 description: 게시글 내용
 *                 example: "게시글 내용입니다."
 *               writer:
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
    const { subject, body, writer } = req.body;

    if (!subject || !body) {
      return res.status(400).json({
        message: "제목과 내용은 필수 입력 항목입니다.",
      });
    }

    const post = createPost(subject, body, writer);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v1/api/posts/{id}:
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
 *             $ref: '#/components/schemas/PostInput'
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
    const { subject, body, writer } = req.body;

    if (!subject || !body || !writer) {
      return res.status(400).json({
        message: "제목, 내용, 작성자는 필수 입력 항목입니다.",
      });
    }

    const post = updatePost(req.params.id, subject, body, writer);
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
