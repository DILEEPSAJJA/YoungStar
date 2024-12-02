const { register, login, setAvatar, getAllUsers } = require("../controllers/userController");
const router = require("express").Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for setting a user's avatar
router.post("/setavatar/:id", setAvatar);

// Route for fetching all users except the one with the provided ID
router.get("/allusers/:id", getAllUsers);

module.exports = router;
