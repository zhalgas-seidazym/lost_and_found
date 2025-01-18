const express = require('express');
const router = express.Router();

const GCSService = require('../../services/gcs-service')

const gcsService = new GCSService();

router.post(
    '/create',
    gcsService.upload.array('itemImages', 5),
    (req, res, next) => gcsService.uploadToGCS(req, res, next),
    (req, res) => {
        console.log(req.files);
        console.log(req.fileUrls);
        res.status(200).json({ fileUrls: req.fileUrls });
    }
);

module.exports = router;