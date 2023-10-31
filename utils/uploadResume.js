const multer = require("multer");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db)

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
        next();
    });
}

module.exports = { handleResumeUpload };