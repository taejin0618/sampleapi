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
 *     description: 시스템에 등록된 모든 게시글의 목록을 조회합니다. 게시글은 ID, 제목, 내용, 작성자, 태그, 우선순위, 고정 여부, 상태 등의 정보를 포함합니다.
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
 * /v3/api/posts/{id}:
 *   get:
 *     operationId: getPostById
 *     summary: 특정 게시글 조회
 *     description: 지정된 ID의 게시글 상세 정보를 조회합니다. 게시글의 모든 정보(제목, 내용, 작성자, 태그, 우선순위, 고정 여부, 상태 등)를 반환합니다.
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
 *     description: 새로운 게시글을 생성합니다. 제목과 내용은 필수 입력 항목이며, 작성자, 태그, 우선순위, 고정 여부, 상태는 선택 사항입니다. 작성자를 지정하지 않으면 기본값으로 '익명'이 설정됩니다.
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
 *                 description: 작성자 이름 (선택 사항, 기본값: 익명)
 *                 example: "홍길동"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 태그 목록 (선택 사항)
 *                 example: ["공지", "중요"]
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: 우선순위 (1-10, 선택 사항, 기본값: 5)
 *                 example: 5
 *               isPinned:
 *                 type: boolean
 *                 description: 고정 여부 (선택 사항, 기본값: false)
 *                 example: false
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deleted]
 *                 description: 게시글 상태 (선택 사항, 기본값: active)
 *                 example: "active"
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
    const { subject, body, writer, tags, priority, isPinned, status } =
      req.body;

    if (!subject || !body) {
      return res.status(400).json({
        message: "제목과 내용은 필수 입력 항목입니다.",
      });
    }

    const post = createPost(
      subject,
      body,
      writer || "익명",
      tags,
      priority,
      isPinned,
      status
    );
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v3/api/posts/{id}/copy:
 *   post:
 *     operationId: copyPost
 *     summary: 게시글 복사
 *     description: 기존 게시글을 복사하여 새 게시글을 생성합니다. 원본 게시글의 제목에 "(복사본)"이 추가되며, 나머지 내용은 동일하게 복사됩니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 복사할 게시글 ID
 *     responses:
 *       201:
 *         description: 게시글 복사 성공
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
router.post("/:id/copy", (req, res) => {
  try {
    const originalPost = getPostById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const copiedPost = createPost(
      `${originalPost.subject} (복사본)`,
      originalPost.body,
      originalPost.writer,
      originalPost.tags,
      originalPost.priority,
      originalPost.isPinned,
      originalPost.status
    );

    res.status(201).json(copiedPost);
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
 *     description: 기존 게시글의 정보를 수정합니다. 제목, 내용, 작성자는 필수 입력 항목이며, 태그, 우선순위, 고정 여부, 상태는 선택 사항입니다. 수정된 게시글의 updatedAt 필드가 자동으로 업데이트됩니다.
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
    const { subject, body, writer, tags, priority, isPinned, status } =
      req.body;

    if (!subject || !body || !writer) {
      return res.status(400).json({
        message: "제목, 내용, 작성자는 필수 입력 항목입니다.",
      });
    }

    const post = updatePost(
      req.params.id,
      subject,
      body,
      writer,
      tags,
      priority,
      isPinned,
      status
    );
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
 * /v3/api/posts/{id}/status:
 *   put:
 *     operationId: updatePostStatus
 *     summary: 게시글 상태 변경
 *     description: 게시글의 상태만 변경합니다. 다른 필드는 수정하지 않으며, 상태는 active(활성), inactive(비활성), deleted(삭제됨) 중 하나를 선택할 수 있습니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상태를 변경할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deleted]
 *                 description: 변경할 상태 (active: 활성, inactive: 비활성, deleted: 삭제됨)
 *                 example: "active"
 *     responses:
 *       200:
 *         description: 상태 변경 성공
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
router.put("/:id/status", (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "상태는 필수 입력 항목입니다.",
      });
    }

    if (!["active", "inactive", "deleted"].includes(status)) {
      return res.status(400).json({
        message:
          "유효하지 않은 상태입니다. (active, inactive, deleted 중 하나)",
      });
    }

    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const updatedPost = updatePost(
      req.params.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      status
    );
    res.json(updatedPost);
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
 *     description: 지정된 ID의 게시글을 삭제합니다. 삭제된 게시글은 복구할 수 없으며, 시스템에서 완전히 제거됩니다.
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
