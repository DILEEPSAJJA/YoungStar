// messageModel.js (Firestore functions for message-related actions)

const { collection, addDoc, query, where, getDocs, orderBy } = require("firebase/firestore");
const db = require("../firebase");

// Reference to the messages collection
const messagesCollection = collection(db, "messages");

// Add a message
const addMessage = async (messageData) => {
  const docRef = await addDoc(messagesCollection, messageData);
  return docRef.id;
};

// Get messages between two users
const getMessages = async (from, to) => {
  const q = query(
    messagesCollection,
    where("users", "array-contains", from),
    orderBy("timestamp", "asc")
  );
  const querySnapshot = await getDocs(q);
  const messages = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.users.includes(to)) {
      messages.push({ id: doc.id, ...data });
    }
  });
  return messages;
};

module.exports = { addMessage, getMessages };
