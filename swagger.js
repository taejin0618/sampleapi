const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "게시판 API",
      version: "4.0.0",
      description: "게시판 CRUD API (v4 - 샘플 데이터 포함)",
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL
          ? process.env.RENDER_EXTERNAL_URL
          : "http://localhost:3001",
        description: process.env.RENDER_EXTERNAL_URL
          ? "프로덕션 서버"
          : "개발 서버",
      },
    ],
    components: {
      schemas: {
        Post: {
          type: "object",
          required: ["title", "content", "author"],
          properties: {
            id: {
              type: "integer",
              description: "게시글 고유 ID",
              example: 1,
            },
            title: {
              type: "string",
              description: "게시글 제목",
              example: "첫 번째 게시글",
            },
            content: {
              type: "string",
              description: "게시글 내용",
              example: "이것은 첫 번째 게시글의 내용입니다.",
            },
            author: {
              type: "string",
              description: "작성자",
              example: "홍길동",
            },
            viewCount: {
              type: "integer",
              description: "조회수",
              example: 0,
              default: 0,
            },
            isPublic: {
              type: "boolean",
              description: "공개 여부 (false면 목록에서 제외)",
              example: true,
              default: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "작성일시",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        PostInput: {
          type: "object",
          required: ["title", "content", "author"],
          properties: {
            title: {
              type: "string",
              description: "게시글 제목",
              example: "첫 번째 게시글",
            },
            content: {
              type: "string",
              description: "게시글 내용",
              example: "이것은 첫 번째 게시글의 내용입니다.",
            },
            author: {
              type: "string",
              description: "작성자",
              example: "홍길동",
            },
            viewCount: {
              type: "integer",
              description: "조회수 (무시됨, 서버에서 항상 0으로 초기화)",
              example: 0,
            },
            isPublic: {
              type: "boolean",
              description: "공개 여부",
              example: true,
              default: true,
            },
          },
        },
        Test: {
          type: "object",
          required: ["name", "value"],
          properties: {
            id: {
              type: "integer",
              description: "항목 고유 ID",
              example: 1,
            },
            name: {
              type: "string",
              description: "테스트명",
              example: "API 연결 테스트",
            },
            value: {
              type: "string",
              description: "테스트값",
              example: "성공",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "작성일시",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "에러 메시지",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
