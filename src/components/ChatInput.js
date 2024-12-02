import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io"; // `BsEmojiSmileFill` has been removed as it's unused
import styled from "styled-components";
import { db } from "../utils/firebase"; // Assuming firebase is configured in a separate file
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ChatInput({ currentChat, currentUser, socket }) {
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();

    // Send chat message to Firebase Firestore
    const sendChat = async (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            try {
                // Add message to Firestore collection
                await addDoc(collection(db, "chats", currentChat._id, "messages"), {
                    text: msg,
                    from: currentUser._id,
                    to: currentChat._id,
                    timestamp: new Date(),
                });

                // Emit the message to the socket for real-time updates
                socket.current.emit("send-msg", {
                    to: currentChat._id,
                    from: currentUser._id,
                    msg,
                });

                setMsg("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    // Fetch messages from Firestore for the current chat
    useEffect(() => {
        const messagesQuery = query(
            collection(db, "chats", currentChat._id, "messages"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => doc.data());
            setMessages(fetchedMessages);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [currentChat]);

    // Auto-scroll when a new message is added
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container>
            <form className="input-container" onSubmit={sendChat}>
                <input
                    type="text"
                    placeholder="type your message here"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button type="submit">
                    <IoMdSend />
                </button>
            </form>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} ref={scrollRef}>
                        <div className={`message ${message.from === currentUser._id ? "sended" : "recieved"}`}>
                            <div className="content">
                                <p>{message.text}</p>
                                {/* Optional: Display timestamp */}
                                <span>{new Date(message.timestamp.seconds * 1000).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  .chat-messages {
    padding: 1rem;
    overflow-y: auto;
    max-height: 300px; /* Adjust as needed */
    .message {
      margin-bottom: 0.5rem;
      .content {
        max-width: 80%;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-size: 1rem;
      }
    }
    .sended .content {
      background-color: #4f04ff21;
      margin-left: auto;
    }
    .recieved .content {
      background-color: #9900ff20;
    }
  }
`;
