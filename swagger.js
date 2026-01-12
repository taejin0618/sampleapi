const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "게시판 API",
      version: "1.0.0",
      description: "게시판 CRUD API 문서",
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
          required: ["subject", "body", "writer"],
          properties: {
            id: {
              type: "integer",
              description: "게시글 고유 ID",
              example: 1,
            },
            subject: {
              type: "string",
              description: "게시글 제목",
              example: "첫 번째 게시글",
            },
            body: {
              type: "string",
              description: "게시글 내용",
              example: "이것은 첫 번째 게시글의 내용입니다.",
            },
            writer: {
              type: "string",
              description: "작성자",
              example: "홍길동",
            },
            createdDate: {
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
          required: ["subject", "body", "writer"],
          properties: {
            subject: {
              type: "string",
              description: "게시글 제목",
              example: "첫 번째 게시글",
            },
            body: {
              type: "string",
              description: "게시글 내용",
              example: "이것은 첫 번째 게시글의 내용입니다.",
            },
            writer: {
              type: "string",
              description: "작성자",
              example: "홍길동",
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
