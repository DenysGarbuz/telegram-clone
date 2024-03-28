![image](https://github.com/DenysGarbuz/telegram-clone/assets/161141971/d5bfddc7-324e-40f2-8848-ce20d057223a)


To run project:
1) go to backed folder -> npm i
2) create "config" folder -> create there "default.json" -> paste there:
  {
    "jwtPrivateKey": "superSecretJWTToken",
    "db": <link_to_your_mongodb_database>
    "isSecure": true,
    "bucketName": <name_of_your_AWS_S3_bucket>,
    "frontendUrl": <url_to_your_frontend_server>
  }
3) go to frontend folder -> npm i 
4) change in "next.config.js" hostname to your AWS S3
5) npm run dev
