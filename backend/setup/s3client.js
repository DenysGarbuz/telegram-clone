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
const GROUP_IMAGE_FOLDER = "images/groups/";
const PROFILE_IMAGE_FOLDER = "images/profile/";
const FILE_BASE_URL = `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/`;

const generateKey = (folder, fileName) => {
  const randomNumber = Math.floor(Math.random() * 90000 + 10000);
  const timestamp = new Date().toISOString();
  return `${folder}${timestamp}-${randomNumber}-${fileName}`;
};

async function saveGroupImage(fileName, file, contentType) {
  const key = generateKey(GROUP_IMAGE_FOLDER, fileName);

  const commandParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(commandParams);
  await client.send(command);
  return FILE_BASE_URL + key;
}

module.exports = { client, saveGroupImage };
