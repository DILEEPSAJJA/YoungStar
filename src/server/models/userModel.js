// userModel.js (Firestore functions for user-related actions)

const { collection, doc, setDoc, getDoc, query, where, getDocs } = require("firebase/firestore");
const db = require("../firebase");

// Reference to the users collection
const usersCollection = collection(db, "users");

// Create or register a user
const createUser = async (userId, userData) => {
  const userDoc = doc(usersCollection, userId);
  await setDoc(userDoc, userData);
};

// Get a single user by ID
const getUserById = async (userId) => {
  const userDoc = doc(usersCollection, userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    return null;
  }
};

// Query users by field (e.g., username or email)
const getUserByField = async (field, value) => {
  const q = query(usersCollection, where(field, "==", value));
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users.length > 0 ? users[0] : null;
};

module.exports = { createUser, getUserById, getUserByField };
