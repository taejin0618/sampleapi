const express = require("express");
const router = express.Router();
const {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
} = require("../data/test");

/**
 * @swagger
 * /v4/api/test:
 *   get:
 *     operationId: getAllTests
 *     summary: 전체 테스트 목록 조회
 *     description: 시스템에 등록된 모든 테스트 항목을 조회합니다. 페이지네이션을 지원합니다.
 *     tags: [Test]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *     responses:
 *       200:
 *         description: 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Test'
 */
router.get("/", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = getAllTests(page);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v4/api/test/{id}:
 *   get:
 *     operationId: getTestById
 *     summary: 특정 테스트 항목 조회
 *     description: 지정된 ID의 테스트 항목 상세 정보를 조회합니다.
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 항목 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: 항목을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req, res) => {
  try {
    const test = getTestById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "항목을 찾을 수 없습니다." });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v4/api/test:
 *   post:
 *     operationId: createTest
 *     summary: 테스트 항목 생성
 *     description: 새로운 테스트 항목을 생성합니다.
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, value]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 테스트명
 *                 example: "테스트 항목 1"
 *               value:
 *                 type: string
 *                 description: 테스트값
 *                 example: "샘플 데이터"
 *           examples:
 *             example1:
 *               summary: "테스트 항목 생성"
 *               value:
 *                 name: "API 연결 테스트"
 *                 value: "성공"
 *     responses:
 *       201:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", (req, res) => {
  try {
    const { name, value } = req.body;

    if (!name || !value) {
      return res.status(400).json({
        message: "name과 value는 필수 입력 항목입니다.",
      });
    }

    const test = createTest(name, value);
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /v4/api/test/{id}:
 *   put:
 *     operationId: updateTest
 *     summary: 테스트 항목 수정
 *     description: 기존 테스트 항목의 정보를 수정합니다.
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 항목 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, value]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 테스트명
 *                 example: "수정된 테스트명"
 *               value:
 *                 type: string
 *                 description: 테스트값
 *                 example: "수정된 값"
 *           examples:
 *             example1:
 *               summary: "테스트 항목 수정"
 *               value:
 *                 name: "API 연결 테스트 (수정)"
 *                 value: "업데이트 완료"
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: 항목을 찾을 수 없음
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
    const { name, value } = req.body;

    if (!name || !value) {
      return res.status(400).json({
        message: "name과 value는 필수 입력 항목입니다.",
      });
    }

    const test = updateTest(req.params.id, name, value);
    if (!test) {
      return res.status(404).json({ message: "항목을 찾을 수 없습니다." });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
