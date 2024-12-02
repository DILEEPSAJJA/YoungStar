// import React from 'react'
// import { Link } from "react-router-dom";
// import ParticlesComponent from '../components/particle';

// function LandingPage() {
//   return (
//     <div className="App">
//       <ParticlesComponent id="particles" />
//       <div className='content'>
//         <center>GeTogether</center>
//         <div className="wrapper">
//           <div className="typing-demo">
//             get connected.
//           </div>
//         </div>
//         <button className="my-button"><Link to="/Login">Click Me</Link></button>
        
//       </div>
      
    
//     </div>
//   )
// }

// export default LandingPage
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { db } from "../utils/firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Firebase Firestore methods
import ParticlesComponent from '../components/particle';

function LandingPage() {
  const [showInfo, setShowInfo] = useState(false); // Track if info container is visible
  const [userCount, setUserCount] = useState(0); // Count of users in Firebase

  useEffect(() => {
    // Fetch users count from Firestore
    const fetchUserCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUserCount(querySnapshot.size); // Set the size of the collection
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  // Show the information container when the user scrolls down
  const handleScroll = () => {
    if (window.scrollY > 100) { // Adjust threshold as needed
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <ParticlesComponent id="particles" />
      <div className='content'>
        <center>YoungStar</center>
        <div className="wrapper">
          <div className="typing-demo">
            get connected.
          </div>
        </div>
        <Link to="/Login">
          <button className="my-button">Click Me</button>
        </Link>
      </div>

      {/* Info Container - Show only after scrolling */}
      {showInfo && (
        <div className="info-container">
          <h2>About GeTogether</h2>
          <p>GeTogether is a platform that brings people together, fostering meaningful connections and collaborations.</p>
          <p><strong>Total Users:</strong> {userCount}</p>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
