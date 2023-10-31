const router = require("express").Router();
const {
    createUser, 
    findUser, 
    findAllUser, 
    updateUser, 
    deleteUser
} = require("../controllers/userController");
const {protect} = require("../middlewares/authMiddleware");

const BASE_URL = "/user"

router.get(BASE_URL, protect, findAllUser);
router.post(BASE_URL, protect, createUser);
router.get(BASE_URL+"/:userId", protect, findUser);
router.put(BASE_URL+"/:userId", protect, updateUser);
router.delete(BASE_URL+"/:userId", protect, deleteUser);

module.exports = router;