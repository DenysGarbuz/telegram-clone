const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const config = require("config");

const clientConfig = {
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAREITKTJU37F256EO",
    secretAccessKey: "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",
  },
};

const client = new S3Client(clientConfig);

const BUCKET_NAME = config.get("bucketName");
const CHATS_FOLDER = "chats/";
const FILE_BASE_URL = `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/`;

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
