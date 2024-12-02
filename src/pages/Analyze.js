import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../utils/firebase";
import { doc, getDoc, collection, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import toast from 'react-hot-toast';
import './Analyze.css';

function Analyze() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const auth = getAuth();
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        toast.error('User is not authenticated.');
        return;
      }

      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCurrentUser({ ...userSnap.data(), id: currentUserId });
      } else {
        toast.error('User not found.');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      toast.error('Failed to fetch user data.');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.username);
        const userSnap = await getDoc(userRef);
        setFriendsList(userSnap.exists() ? userSnap.data().friends || [] : []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    }
  }, [currentUser]);

  const fetchReceivedRequests = useCallback(async () => {
    if (currentUser) {
      try {
        const requestsRef = collection(db, "friendRequests");
        const querySnapshot = await getDocs(requestsRef);
        const received = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(request => request.toUser === currentUser.username && request.status === "pending");
        setReceivedRequests(received);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    }
  }, [currentUser]);

  const calculateMatchPercentage = (user1, user2) => {
    const interests1 = user1.interests || [];
    const interests2 = user2.interests || [];
    const hobbies1 = user1.hobbies ? user1.hobbies.split(',') : [];
    const hobbies2 = user2.hobbies ? user2.hobbies.split(',') : [];

    const commonInterests = interests1.filter(interest => interests2.includes(interest));
    const commonHobbies = hobbies1.filter(hobby => hobbies2.includes(hobby));

    const totalInterests = new Set([...interests1, ...interests2]).size;
    const totalHobbies = new Set([...hobbies1, ...hobbies2]).size;

    const interestMatch = totalInterests > 0 ? (commonInterests.length / totalInterests) * 100 : 0;
    const hobbyMatch = totalHobbies > 0 ? (commonHobbies.length / totalHobbies) * 100 : 0;

    return Math.round((interestMatch + hobbyMatch) / 2);
  };

  useEffect(() => {
    if (currentUser && users.length > 0) {
      const allMatches = users
        .filter(user => user.username !== currentUser.username && !friendsList.includes(user.username))
        .map(user => ({
          ...user,
          matchPercentage: calculateMatchPercentage(currentUser, user),
        }))
        .filter(user => user.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      setMatches(allMatches);
    }
  }, [users, currentUser, friendsList]);

  const handleSendRequest = async (matchedUser) => {
    try {
      const requestRef = collection(db, "friendRequests");
      await setDoc(doc(requestRef), {
        fromUser: currentUser.username,
        fromUserId: currentUser.id,
        toUser: matchedUser.username,
        toUserId: matchedUser.id,
        status: "pending",
      });

      toast.success(`Friend request sent to ${matchedUser.username}!`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Error sending friend request. Try again.');
    }
  };

  const handleAcceptRequest = async (requestId, fromUser) => {
    try {
      // Update the current user's friend list
      const currentUserRef = doc(db, "users", currentUser.userid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (currentUserSnap.exists()) {
        const currentUserFriends = currentUserSnap.data().friends || [];
        if (!currentUserFriends.includes(fromUser)) {
          await updateDoc(currentUserRef, { friends: [...currentUserFriends, fromUser] });
        }
      }

      // Update the friend's friend list
      const friendRef = doc(db, "users", fromUser);
      const friendSnap = await getDoc(friendRef);

      if (friendSnap.exists()) {
        const friendFriends = friendSnap.data().friends || [];
        if (!friendFriends.includes(currentUser.username)) {
          await updateDoc(friendRef, { friends: [...friendFriends, currentUser.username] });
        }
      }

      // Delete the friend request
      await deleteDoc(doc(db, "friendRequests", requestId));
      setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));

      toast.success(`${fromUser} added to your friends list.`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Error accepting friend request.');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, "friendRequests", requestId));
      setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
      toast.success('Friend request declined!');
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error('Error declining friend request.');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [fetchCurrentUser, fetchUsers]);

  useEffect(() => {
    fetchFriends();
    fetchReceivedRequests();
  }, [fetchFriends, fetchReceivedRequests]);

  return (
    <div className="analyze-container">
      <h2>Suggested Matches</h2>
      {matches.length > 0 ? (
        <div className="matches-list">
          {matches.map(match => (
            <div key={match.id} className="match-item">
              <h3>{match.username}</h3>
              <p>Match Percentage: {match.matchPercentage}%</p>
              {friendsList.includes(match.username) ? (
                <button className="friend-btn" disabled>
                  Already Friends
                </button>
              ) : (
                <button onClick={() => handleSendRequest(match)} className="send-request-btn">
                  Send Friend Request
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No matches found.</p>
      )}
      <div className="received-requests">
        <h3>Friend Requests</h3>
        {receivedRequests.length > 0 ? (
          <ul>
            {receivedRequests.map(request => (
              <li key={request.id}>
                <p>{request.fromUser}</p>
                <button onClick={() => handleAcceptRequest(request.id, request.fromUser)}>Accept</button>
                <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friend requests received.</p>
        )}
      </div>
      <button onClick={() => navigate('/home')} className="home-btn">Home</button>
    </div>
  );
}

export default Analyze;
