const router = require("express").Router();
const {
    applyToJob
} = require("../controllers/jobApplicationController");
const { handleResumeUpload } = require("../utils/uploadResume");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post('/jobApplication/:jobId', protect, handleResumeUpload, applyToJob);

module.exports = router;