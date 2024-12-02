// import React, { useState, useEffect } from "react";
// import { db } from "../utils/firebase";
// import {
//   doc,
//   addDoc,
//   getDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import "./Home.css";

// function Home() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [friends, setFriends] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Fetch the current user's data and friends list
//   useEffect(() => {
//     const fetchCurrentUserData = async () => {
//       const auth = getAuth();
//       const userId = auth.currentUser ? auth.currentUser.uid : null;

//       if (userId) {
//         const userRef = doc(db, "users", userId);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           setCurrentUser(userData);

//           // Set the friends list
//           const friendsList = userData.friends || [];
//           setFriends(friendsList);
//         }
//       }
//     };

//     fetchCurrentUserData();
//   }, []);

//   // Fetch messages when an active chat is selected
//   useEffect(() => {
//     if (activeChat && currentUser) {
//       const chatId = getChatId(currentUser.uid, activeChat.id);
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const q = query(messagesRef, orderBy("timestamp", "asc"));

//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const loadedMessages = snapshot.docs.map((doc) => doc.data());
//         setMessages(loadedMessages);
//       });

//       return () => unsubscribe();
//     }
//   }, [activeChat, currentUser]);

//   // Generate a unique chat ID based on user IDs
//   const getChatId = (userId1, userId2) => [userId1, userId2].sort().join("_");

//   // Handle sending a new message
//   const handleSendMessage = async () => {
//     // Check if currentUser and newMessage are properly defined
//     if (!currentUser || !currentUser.uid || !newMessage.trim() || !activeChat) {
//       console.error("Message could not be sent due to missing data.");
//       return;
//     }

//     const chatId = getChatId(currentUser.uid, activeChat.id);
//     const messagesRef = collection(db, "chats", chatId, "messages");

//     try {
//       await addDoc(messagesRef, {
//         sender: currentUser.uid, // Ensure the sender is correctly set
//         receiver: activeChat.id,
//         message: newMessage,
//         timestamp: new Date(),
//       });
//       setNewMessage(""); // Clear message input after sending
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="home-container">
//       <div className="sidebar">
//         <h2>Friends</h2>
//         <ul>
//           {friends.length > 0 ? (
//             friends.map((friend, index) => (
//               <li key={index} onClick={() => setActiveChat(friend)}>
//                 <span>
//                   {friend || "Unknown"}
//                 </span>
//               </li>
//             ))
//           ) : (
//             <p>No friends added yet.</p>
//           )}
//         </ul>
//       </div>

//       <div className="chat-area">
//         {activeChat ? (
//           <>
//             <h3>Chat with {activeChat.username}</h3>
//             <div className="messages">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`message ${
//                     msg.sender === currentUser.uid ? "sent" : "received"
//                   }`}
//                 >
//                   <p>{msg.message}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="message-input">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type your message..."
//               />
//               <button onClick={handleSendMessage}>Send</button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h3>Welcome to Chat!</h3>
//             <p>Select a friend to start chatting.</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;


// import React, { useState, useEffect } from "react";
// import { db } from "../utils/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { io } from "socket.io-client"; // Import socket.io-client
// import "./Home.css";

// const socket = io("http://localhost:4000"); // Connect to the server

// function Home() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [friends, setFriends] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Fetch current user's data and friends list
//   useEffect(() => {
//     const fetchCurrentUserData = async () => {
//       const auth = getAuth();
//       const userId = auth.currentUser ? auth.currentUser.uid : null;

//       if (userId) {
//         const userRef = doc(db, "users", userId);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           setCurrentUser(userData);

//           const friendsList = userData.friends || [];
//           setFriends(friendsList);

//           // Join the socket room when the user is authenticated (optional based on userId)
//           socket.emit("joinRoom", userData.userid);
//         }
//       }
//     };

//     fetchCurrentUserData();
//   }, []);

//   // Listen for incoming messages
//   useEffect(() => {
//     socket.on("chatMessage", (messageData) => {
//       if (messageData.receiverId === currentUser?.userid || messageData.senderId === currentUser?.userid) {
//         setMessages((prevMessages) => [...prevMessages, messageData]);
//       }
//     });

//     return () => {
//       socket.off("chatMessage");
//     };
//   }, [currentUser]);

//   // Handle sending a new message
//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !activeChat) return;

//     const messageData = {
//       senderId: currentUser.userid,
//       receiverId: activeChat.userid, // Target friend
//       message: newMessage,
//       timestamp: new Date(),
//     };

//     socket.emit("chatMessage", messageData); // Emit message to server

//     setMessages((prevMessages) => [...prevMessages, messageData]);
//     setNewMessage(""); // Clear message input after sending
//   };

//   return (
//     <div className="home-container">
//       <div className="sidebar">
//         <h2>Friends</h2>
//         <ul>
//           {friends.length > 0 ? (
//             friends.map((friend, index) => (
//               <li key={index} onClick={() => setActiveChat(friend)}>
//                 <span>{friend || "Unknown"}</span>
//               </li>
//             ))
//           ) : (
//             <p>No friends added yet.</p>
//           )}
//         </ul>
//       </div>

//       <div className="chat-area">
//         {activeChat ? (
//           <>
//             <h3>Chat with {activeChat.username}</h3>
//             <div className="messages">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`message ${
//                     msg.senderId === currentUser?.userid ? "sent" : "received"
//                   }`}
//                 >
//                   <p>{msg.message}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="message-input">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type your message..."
//               />
//               <button onClick={handleSendMessage}>Send</button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h3>Welcome to Chat!</h3>
//             <p>Select a friend to start chatting.</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;







// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { allUsersRoute, host } from "../utils/APIRoutes";
// import Contacts from "../components/Contacts";
// import Welcome from "../components/Welcome";
// import ChatContainer from "../components/ChatContainer";
// import { io } from "socket.io-client";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../utils/firebase";

// function Home() {
//   const socket = useRef();
//   const navigate = useNavigate();

//   const [contacts, setContacts] = useState([]);
//   const [currentUser, setCurrentUser] = useState(undefined);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [friends, setFriends] = useState([]);
//   const [messages, setMessages] = useState({}); // Store messages per friend (by friendId)
//   const [newMessage, setNewMessage] = useState(""); // New message input

//   useEffect(() => {
//     const local_func = async () => {
//       if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
//         navigate("/login");
//       } else {
//         const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
//         setCurrentUser(user);
//         setIsLoaded(true);
//       }
//     };
//     local_func();
//   }, [navigate]);

//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io(host);
//       socket.current.emit("add-user", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       if (currentUser) {
//         const userRef = doc(db, "users", currentUser._id);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           setFriends(userData.friends || []);
//         }
//       }
//     };
//     fetchFriends();
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (currentUser) {
//         if (currentUser.isAvatarImageSet) {
//           const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
//           setContacts(data.data);
//         } else {
//           navigate("/setAvatar");
//         }
//       }
//     };
//     fetchContacts();
//   }, [currentUser, navigate]);

//   const handleChatChange = (chat) => {
//     setCurrentChat(chat);
//   };

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !currentChat) return;

//     const messageData = {
//       senderId: currentUser._id,
//       receiverId: currentChat._id,
//       message: newMessage,
//       timestamp: new Date(),
//     };

//     setMessages((prevMessages) => {
//       const newMessages = { ...prevMessages };
//       if (!newMessages[currentChat._id]) {
//         newMessages[currentChat._id] = [];
//       }
//       newMessages[currentChat._id].push(messageData);
//       return newMessages;
//     });

//     setNewMessage(""); // Clear the message input field
//   };

//   // Format timestamp to display day, date, and time
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
//     const formattedDate = date.toLocaleDateString(undefined, options);
//     const formattedTime = date.toLocaleTimeString();
//     return { date: formattedDate, time: formattedTime };
//   };

//   return (
//     <Container>
//       <div className="container">
//         <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
//         {isLoaded && currentChat === undefined ? (
//           <Welcome />
//         ) : (
//           <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
//         )}
//       </div>
//       <Sidebar>
//         <h2>Friends</h2>
//         <ul>
//           {friends.length > 0 ? (
//             friends.map((friendId) => (
//               <li key={friendId} onClick={() => setCurrentChat({ _id: friendId, username: friendId })}>
//                 <span>{friendId}</span> {/* Displaying friendId; you can replace it with the actual friend's name */}
//               </li>
//             ))
//           ) : (
//             <p>No friends added yet.</p>
//           )}
//         </ul>
//       </Sidebar>
//       {currentChat && (
//         <ChatArea>
//           <h3>Chat with {currentChat.username}</h3>
//           <div className="messages">
//             <div className="date-info">
//               <span>{new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
//             </div>
//             {messages[currentChat._id] && messages[currentChat._id].length > 0 ? (
//               messages[currentChat._id].map((msg, index) => {
//                 const { time } = formatTimestamp(msg.timestamp);
//                 return (
//                   <div key={index} className={`message ${msg.senderId === currentUser._id ? "sent" : "received"}`}>
//                     <div className="message-header">
//                       <span className="message-username">
//                         {msg.senderId === currentUser._id ? "You" : currentChat.username}
//                       </span>
//                     </div>
//                     <p>{msg.message}</p>
//                     <div className="message-time">{time}</div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p>No messages yet.</p>
//             )}
//           </div>
//           <div className="message-input">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//             />
//             <button onClick={handleSendMessage}>Send</button>
//           </div>
//         </ChatArea>
//       )}
//     </Container>
//   );
// }

// const Container = styled.div`
//   height: 100vh;
//   width: 100vw;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 1rem;
//   align-items: center;
//   background-color: #131324;
//   .container {
//     height: 85vh;
//     width: 85vw;
//     background-color: #00000076;
//     display: grid;
//     grid-template-columns: 25% 75%;
//     @media screen and (min-width: 720px) and (max-width: 1080px) {
//       grid-template-columns: 35% 65%;
//     }
//   }
// `;

// const Sidebar = styled.div`
//   width: 25%;
//   background-color: #1f1f1f;
//   padding: 1rem;
//   color: white;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   overflow-y: auto;
// `;

// const ChatArea = styled.div`
//   width: 75%;
//   padding: 1rem;
//   background-color: #1c1c1c;
//   color: white;
//   display: flex;
//   flex-direction: column;
// `;

// export default Home;




// import React, { useState, useEffect } from 'react';
// import { db, auth } from '../utils/firebase';
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   getDocs,
// } from 'firebase/firestore';
// import { signInAnonymously } from 'firebase/auth';
// import './Home.css';

// const Home = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [userMap, setUserMap] = useState({}); // Map senderId to username

//   useEffect(() => {
//     // Sign in anonymously
//     signInAnonymously(auth).catch((error) => console.log('Auth Error:', error));
//   }, []);

//   // Fetch users to map senderId to usernames
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const usersSnapshot = await getDocs(collection(db, 'users'));
//       const map = {};
//       usersSnapshot.forEach((doc) => {
//         map[doc.id] = doc.data().username;
//       });
//       setUserMap(map);
//     };

//     fetchUsers().catch((error) => console.log('Error fetching users:', error));
//   }, []);

//   // Fetch messages from Firestore
//   useEffect(() => {
//     const q = query(collection(db, 'chats'), orderBy('timestamp', 'asc'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(fetchedMessages);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Send a message
//   const sendMessage = async () => {
//     if (newMessage.trim()) {
//       await addDoc(collection(db, 'chats'), {
//         text: newMessage,
//         senderId: auth.currentUser?.uid,
//         timestamp: serverTimestamp(),
//       });
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="container">
//       <h2 className="chat-header">Chat Room</h2>
//       <div className="messages-container">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`message ${message.senderId === auth.currentUser?.uid ? 'sent' : 'received'}`}
//           >
//             <div className="sender">
//               {message.senderId === auth.currentUser?.uid
//                 ? 'You'
//                 : userMap[message.senderId] || 'Unknown'}:
//             </div>
//             <div className="text">{message.text}</div>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebase';
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser?.uid);
        const userDoc = await getDoc(userDocRef);
        const currentUserData = userDoc.data();

        if (currentUserData?.friends?.length > 0) {
          const q = query(
            collection(db, 'users'),
            where('username', 'in', currentUserData.friends)
          );

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedFriends = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFriends(fetchedFriends);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const createOrNavigateToRoom = async (friend) => {
    const roomId = [auth.currentUser?.uid, friend.id].sort().join('_');
    const roomDocRef = doc(db, 'rooms', roomId);

    try {
      const roomDoc = await getDoc(roomDocRef);

      if (!roomDoc.exists()) {
        await setDoc(roomDocRef, {
          members: [auth.currentUser?.uid, friend.id],
          createdAt: new Date(),
        });
      }

      navigate(`/room/${roomId}`, { state: { friend, roomId } });
    } catch (error) {
      console.error('Error creating or navigating to the room:', error);
    }
  };

  const navigateToVideoRoom = () => {
    // This will navigate to the VideoRoom page
    navigate('/VideoRoom');
  };

  return (
    <div className="home-container">
      <h2 className="header">Friend Rooms</h2>
      <div className="friends-container">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="friend-box">
              <p>{friend.username}</p>
              <button onClick={() => createOrNavigateToRoom(friend)}>
                Chat with {friend.username}
              </button>
            </div>
          ))
        ) : (
          <p>No friends found. Add some friends to start chatting!</p>
        )}
      </div>

      {/* Add button to navigate to VideoRoom */}
      <div className="video-room-container">
        <button onClick={navigateToVideoRoom} className="video-room-button">
          Go to Video Room
        </button>
      </div>
    </div>
  );
};

export default Home;
