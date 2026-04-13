require("dotenv").config();

function required(key) {
  const value = process.env[key];
  if (!value) {
    console.error(`[config] missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
}

function optional(key, fallback) {
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
}

const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: parseInt(optional("PORT", "3003"), 10),
  mongodbUrl: required("MONGODB_URL"),
  jwtPrivateKey: required("JWT_PRIVATE_KEY"),
  frontendUrl: required("FRONTEND_URL"),
  cookieSecure: optional("COOKIE_SECURE", "false") === "true",
  aws: {
    accessKeyId: required("AWS_ACCESS_KEY_ID"),
    secretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
    region: required("AWS_REGION"),
    bucketName: required("AWS_BUCKET_NAME"),
  },
};

module.exports = env;
