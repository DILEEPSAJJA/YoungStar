import React, { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebase';
import { useLocation } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import './Room.css';

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userMap, setUserMap] = useState({}); // Map senderId to username
  const [error, setError] = useState(''); // To hold error message
  const location = useLocation();
  const { friend, roomId } = location.state; // Extracted roomId from location.state

  // Fetch usernames for sender IDs
  useEffect(() => {
    const fetchUsers = async () => {
      const userDocs = await collection(db, 'users');
      const unsubscribe = onSnapshot(userDocs, (snapshot) => {
        const map = {};
        snapshot.forEach((doc) => {
          map[doc.id] = doc.data().username;
        });
        setUserMap(map);
      });

      return () => unsubscribe();
    };

    fetchUsers();
  }, []);

  // Fetch messages for the room
  useEffect(() => {
    const q = query(
      collection(db, 'rooms', roomId, 'messages'), // Use destructured roomId
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [roomId]); // Add roomId as a dependency

  // Send a message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, 'rooms', roomId, 'messages'), {
          // Use destructured roomId
          text: newMessage,
          senderId: auth.currentUser?.uid,
          timestamp: serverTimestamp(),
        });
        setNewMessage(''); // Clear input
        setError(''); // Reset error
      } catch (err) {
        console.log('Error sending message:', err);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  // Format timestamp into local time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container">
      <h2 className="chat-header">Chat Room {friend.username}</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === auth.currentUser?.uid ? 'sent' : 'received'
            }`}
          >
            {/* Display sender's username */}
            <div className="sender">
              {userMap[message.senderId] || 'Unknown User'}
            </div>

            {/* Display message text */}
            <div className="text">{message.text}</div>

            {/* Display local time */}
            <div className="timestamp">{formatTime(message.timestamp)}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <button>🎙️ Record</button>
      </div>
    </div>
  );
};

export default Room;
