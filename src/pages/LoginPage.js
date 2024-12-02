// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // For getting the passed state and navigating
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { collection, getDoc, doc } from "firebase/firestore"; // Firestore imports
// import { auth, db } from "../utils/firebase"; // Firebase auth and Firestore imports
// import toast from 'react-hot-toast'; // Import for toast notifications
// import './LoginPage.css'; // Ensure you have the CSS file here

// function LoginPage() {
  
//   const location = useLocation(); // Get the location object
//   const navigate = useNavigate(); // Hook to navigate to different routes
//   const gender = location.state?.gender || ''; // Extract gender from the location state

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       // Authenticate user with Firebase Auth
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const userId = userCredential.user.uid;

//       // Check if the user exists in the Firestore 'users' collection
//       const userDocRef = doc(collection(db, "users"), userId);
//       const userSnapshot = await getDoc(userDocRef);

//       if (userSnapshot.exists()) {
//         // User exists in the collection
//         toast.success("Login successful! Redirecting...", { position: "top-center" });
//         navigate('/Analyze');
//       } else {
//         // User not found in the Firestore collection
//         toast.error("User not found in the database.", { position: "top-center" });
//       }
//     } catch (error) {
//       // Handle errors (e.g., invalid credentials)
//       toast.error("Error logging in. Please check your credentials.", { position: "top-center" });
//       console.error("Error logging in:", error);
//     }
//   };

//   const handleSignUp = () => {
//     // Navigate to Register.js and pass gender in the location state
//     navigate('/register', { state: { gender } });
//   };

//   return (
//     <form className="form" onSubmit={handleLogin}>
//       <span className="input-span">
//         <label htmlFor="email" className="label">Email</label>
//         <input 
//           type="email" 
//           name="email" 
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </span>
//       <span className="input-span">
//         <label htmlFor="password" className="label">Password</label>
//         <input 
//           type="password" 
//           name="password" 
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </span>

//       {/* Gender Field */}
//       <span className="input-span">
//         <label htmlFor="gender" className="label">Gender</label>
//         <input 
//           type="text" 
//           name="gender" 
//           id="gender"
//           value={gender}
//           readOnly // Make it read-only since it's pre-filled
//         />
//       </span>

//       <span className="span"><a href="#">Forgot password?</a></span>
//       <input className="submit" type="submit" value="Log in" />
//       <span className="span">Don't have an account? <a href="#" onClick={handleSignUp}>Sign up</a></span>
//     </form>
//   );
// }

// export default LoginPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import toast from 'react-hot-toast';
import './LoginPage.css';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const gender = location.state?.gender || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(collection(db, "users"), userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        toast.success("Login successful! Redirecting...", { position: "top-center" });
        navigate('/Analyze');
      } else {
        toast.error("User not found in the database.", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error logging in. Please check your credentials.", { position: "top-center" });
      console.error("Error logging in:", error);
    }
  };

  const handleSignUp = () => {
    navigate('/register', { state: { gender } });
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <span className="input-span">
        <label htmlFor="email" className="label">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </span>
      <span className="input-span">
        <label htmlFor="password" className="label">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </span>

      <span className="input-span">
        <label htmlFor="gender" className="label">Gender</label>
        <input
          type="text"
          name="gender"
          id="gender"
          value={gender}
          readOnly
        />
      </span>

      {/* Replaced <a> with styled <button> for accessibility */}
      <span className="span">
        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </button>
      </span>

      <input className="submit" type="submit" value="Log in" />

      <span className="span">
        Don't have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={handleSignUp}
        >
          Sign up
        </button>
      </span>
    </form>
  );
}

export default LoginPage;
