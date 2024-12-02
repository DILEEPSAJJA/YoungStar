const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();

// Route to add a new message
router.post("/addmsg", addMessage);

// Route to fetch messages between two users
router.post("/getmsg", getMessages);

module.exports = router;
    