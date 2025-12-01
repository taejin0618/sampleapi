const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '게시판 API',
      version: '1.0.0',
      description: '게시판 CRUD API 문서',
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL
          ? process.env.RENDER_EXTERNAL_URL
          : 'http://localhost:3001',
        description: process.env.RENDER_EXTERNAL_URL
          ? '프로덕션 서버'
          : '개발 서버',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
