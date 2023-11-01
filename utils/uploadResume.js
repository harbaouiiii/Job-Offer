const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
})

const handleResumeUpload = (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({
                error: 'Invalid file upload!'
            })
        } else if (err) {
            return res.status(500).send({
                error: 'Internal server error!'
            })
        }
        req.resumeData = req.file.buffer.toString("base64");
        next();
    });
}

module.exports = handleResumeUpload;