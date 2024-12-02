const { db } = require("../firebase");

// Get Messages
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Fetch messages between 'from' and 'to'
    const messagesSnapshot = await db
      .collection("messages")
      .where("users", "array-contains-any", [from, to])
      .orderBy("createdAt", "asc")
      .get();

    const messages = [];
    messagesSnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter messages between specific users
      if (data.users.includes(from) && data.users.includes(to)) {
        messages.push({
          fromSelf: data.sender === from,
          message: data.message.text,
        });
      }
    });

    return res.json(messages);
  } catch (ex) {
    next(ex);
  }
};

// Add Message
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    // Create message document in Firestore
    const data = {
      message: { text: message },
      users: [from, to],
      sender: from,
      createdAt: new Date().toISOString(),
    };

    const response = await db.collection("messages").add(data);

    if (response.id) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.status(500).json({ msg: "Failed to add message to Firestore" });
    }
  } catch (ex) {
    next(ex);
  }
};
