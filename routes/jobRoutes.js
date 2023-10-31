const router = require("express").Router();
const {
    createJob,
    findAllJobs,
    findJob,
    updateJob,
    deleteJob,
    filterJobs
} = require("../controllers/jobController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const BASE_URL = "/job"

router.post(BASE_URL, protect, authorize(['RECRUTER','ADMIN']), createJob);
router.get(BASE_URL, protect, findAllJobs);
router.get(BASE_URL + "/:jobId", protect, findJob);
router.put(BASE_URL + "/:jobId", protect, authorize(['RECRUTER','ADMIN']), updateJob);
router.delete(BASE_URL + "/:jobId", protect, authorize(['RECRUTER','ADMIN']), deleteJob);
router.get("/jobs", protect, filterJobs);

module.exports = router;