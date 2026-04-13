// Runs via Jest setupFiles — BEFORE any backend module is required.
process.env.NODE_ENV = "test";
process.env.PORT = "0";
process.env.JWT_PRIVATE_KEY = "test-jwt-secret-for-unit-tests-only";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.COOKIE_SECURE = "false";
process.env.AWS_ACCESS_KEY_ID = "test-key";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret";
process.env.AWS_REGION = "us-east-1";
process.env.AWS_BUCKET_NAME = "test-bucket";
// MONGODB_URL is set dynamically by the memory-server hook.
process.env.MONGODB_URL = "mongodb://127.0.0.1:0/placeholder";
