const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json"); // Replace with the path to your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Server-side API to fetch friends of the current user with detailed info
app.get("/api/friends/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch the user document
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the friends' list from the current user
    const userData = userDoc.data();
    const friendIds = userData.friends || [];
    
    // Fetch the detailed information of each friend
    const friendsData = [];
    for (const friendId of friendIds) {
      const friendDoc = await db.collection("users").doc(friendId).get();
      if (friendDoc.exists) {
        const friendData = friendDoc.data();
        friendsData.push(friendData);  // Add friend's full data (e.g., username, hobbies, etc.)
      }
    }

    // Respond with the array of friends' data
    res.json(friendsData);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// API to fetch friends of the current user
app.get("/api/friends/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    const userData = userDoc.data();
    const friends = userData.friends || [];
    res.json(friends);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
