const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const config = require('../config/config')

class GCSService {
    constructor() {
        this.storage = new Storage({
            keyFilename: path.join(__dirname, '..', 'config', "gcloud-key.json"),
            projectId: config.gcsProjectId,
        });
        this.bucketName = config.gcsBucketName;
        this.bucket = this.storage.bucket(this.bucketName);
        this.multerStorage = multer.memoryStorage();
        this.upload = multer({
            storage: this.multerStorage,
            fileFilter: this.fileFilter.bind(this),
            limits: {
                fileSize: 1024 * 1024 * 10,
            },
        });
    }

    fileFilter(req, file, cb) {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/svg+xml"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images are allowed."));
        }
    }

    async uploadToGCS(req, res, next) {
        if (!req.files || req.files.length === 0) {
            req.fileUrls = [];
            return next();
        }

        try {
            const uploadPromises = req.files.map((file) => this.uploadSingleFileToGCS(file));
            req.fileUrls = await Promise.all(uploadPromises);
            next();
        } catch (error) {
            console.error("Error uploading files to GCS:", error);
            res.status(500).send({ error: "Failed to upload files to Google Cloud Storage." });
        }
    }

    uploadSingleFileToGCS(file) {
        return new Promise((resolve, reject) => {
            const sanitizedFileName = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "");
            const blob = this.bucket.file(sanitizedFileName);

            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
            });

            blobStream.on("error", (err) => {
                console.error(err);
                reject(err);
            });

            blobStream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
            console.log(`File ${file.originalname} uploaded to storage.`);
        });
    }

    async deleteFile(fileName) {
        try {
            if (!fileName) {
                throw new Error("File name is required");
            }

            const file = this.bucket.file(fileName);

            const [exists] = await file.exists();
            if (!exists) {
                throw new Error(`File ${fileName} does not exist.`);
            }

            await file.delete();
            console.log(`File ${fileName} deleted from storage.`);
        } catch (error) {
            console.error(`Error deleting file ${fileName}:`, error.message);
            throw new Error(error.message);
        }
    }


}

module.exports = GCSService;
