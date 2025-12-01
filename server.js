const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenAPI 스펙 JSON 제공
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(swaggerSpec);
});

// Swagger UI 설정
const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "게시판 API 문서",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// API 라우트
app.use("/v2/api/posts", postsRouter);

// 루트 경로
app.get("/", (req, res) => {
  // 동적으로 기본 URL 생성
  const protocol = req.protocol || (req.headers['x-forwarded-proto'] || 'http').split(',')[0];
  const host = req.get('host') || `localhost:${PORT}`;
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `${protocol}://${host}`;

  res.json({
    message: "API 서버가 실행 중입니다.",
    endpoints: {
      posts: "/v2/api/posts",
    },
    docs: `${baseUrl}/api-docs`,
    spec: `${baseUrl}/api-docs.json`,
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ message: "요청한 리소스를 찾을 수 없습니다." });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

// 서버 시작 (로컬 개발 환경에서만)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`OpenAPI Spec: http://localhost:${PORT}/api-docs.json`);
  });
}

module.exports = app;
