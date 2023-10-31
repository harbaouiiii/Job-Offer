const router = require("express").Router();
const {
    applyToJob
} = require("../controllers/jobApplicationController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post('/jobApplication/:jobId', protect, applyToJob);

module.exports = router;