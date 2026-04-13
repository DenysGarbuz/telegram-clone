const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const env = require("../config/env");

const client = new S3Client({
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

const BUCKET_NAME = env.aws.bucketName;
const CHATS_FOLDER = "chats/";
const FILE_BASE_URL = `https://${BUCKET_NAME}.s3.${env.aws.region}.amazonaws.com/`;

const generateKey = (folder, id, fileName) => {
  const randomNumber = Math.floor(Math.random() * 90000 + 10000);
  const timestamp = new Date().toISOString();
  return `${folder}${id}/${timestamp}-${randomNumber}-${fileName}`;
};

async function saveChatImage(chatId, fileName, buffer, contentType) {
  const key = generateKey(CHATS_FOLDER, chatId, fileName);

  const commandParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(commandParams);
  await client.send(command);
  return FILE_BASE_URL + key;
}

async function saveMultipleFiles(chatId, files) {
  const fileUrls = [];
  for (const file of files) {
    const key = generateKey(CHATS_FOLDER, chatId, file.fileName);

    const commandParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.contentType,
    };

    const command = new PutObjectCommand(commandParams);
    await client.send(command);
    fileUrls.push(FILE_BASE_URL + key);
  }
  return fileUrls;
}

module.exports = { client, saveChatImage, saveMultipleFiles };
