const dotenv = require('dotenv');
const path = require('path');

const BaseDir = path.resolve(__dirname, '..', '..');

dotenv.config({path: path.join(BaseDir, '.env')});

module.exports = {
    baseDir: BaseDir,
    mongodb: process.env.MONGODB_URI,
    port: process.env.PORT,
    host: process.env.HOST,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: process.env.JWT_EXPIRES,
    redisHost: process.env.REDIS_HOST,
    redisDatabase: process.env.REDIS_DATABASE,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    rootEmail: process.env.ROOT_EMAIL,
    rootEmailPass: process.env.ROOT_EMAIL_PASS,
    gcsProjectId: process.env.GCS_PROJECT_ID,
    gcsBucketName: process.env.GCS_BUCKET_NAME
};