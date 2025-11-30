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
  res.send(swaggerSpec);
});

// Swagger UI 설정
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "게시판 API 문서",
  })
);

// API 라우트
app.use("/v3/api/posts", postsRouter);

// 루트 경로
app.get("/", (req, res) => {
  res.json({
    message: "API 서버가 실행 중입니다.",
    endpoints: {
      posts: "/v3/api/posts",
    },
    docs: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api-docs`
      : "http://localhost:3001/api-docs",
    spec: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api-docs.json`
      : "http://localhost:3001/api-docs.json",
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
