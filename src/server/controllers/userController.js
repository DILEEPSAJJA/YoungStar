const { db, auth } = require("../firebase");
const bcrypt = require("bcrypt");

// Register a new user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const usernameCheck = await db.collection("users").where("username", "==", username).get();
    if (!usernameCheck.empty) {
      return res.json({ msg: "Username already used", status: false });
    }

    const emailCheck = await db.collection("users").where("email", "==", email).get();
    if (!emailCheck.empty) {
      return res.json({ msg: "Email already used", status: false });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      username,
      email,
      password: hashedPassword,
      isAvatarImageSet: false,
      avatarImage: "",
    };

    const response = await db.collection("users").add(userData);

    if (response.id) {
      return res.json({ status: true, user: { id: response.id, ...userData } });
    } else {
      return res.status(500).json({ msg: "Failed to register user" });
    }
  } catch (ex) {
    next(ex);
  }
};

// Login user
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const userSnapshot = await db.collection("users").where("username", "==", username).get();
    if (userSnapshot.empty) {
      return res.json({ msg: "Incorrect Username 🥲", status: false });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Password 🥲", status: false });
    }

    return res.json({ status: true, user: { id: userDoc.id, ...user } });
  } catch (ex) {
    next(ex);
  }
};

// Set Avatar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ msg: "User not found" });
    }

    await userRef.update({
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.json({
      isSet: true,
      image: avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

// Get All Users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usersSnapshot = await db.collection("users").get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      if (doc.id !== id) {
        const user = doc.data();
        users.push({
          id: doc.id,
          username: user.username,
          email: user.email,
          avatarImage: user.avatarImage,
        });
      }
    });

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
