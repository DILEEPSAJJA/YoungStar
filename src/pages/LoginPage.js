// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom'; // For getting the passed state
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../utils/firebase"; // import firebase auth
// import './Login.css'

// function LoginPage() {
//   const location = useLocation(); // Get the location object
//   const gender = location.state?.gender || ''; // Extract gender from the location state

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log("User logged in successfully!");
//       // Redirect to a new page or show a success message
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Gender:
//           <input
//             type="text"
//             value={gender} // Set gender value here
//             readOnly // Make it read-only since it's pre-filled
//           />
//         </label>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default LoginPage;




// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom'; // For getting the passed state
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../utils/firebase"; // import firebase auth
// import './LoginPage.css'; // Ensure you have the CSS file here

// function LoginPage() {
//   const location = useLocation(); // Get the location object
//   const gender = location.state?.gender || ''; // Extract gender from the location state

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log("User logged in successfully!");
//       // Redirect to a new page or show a success message
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
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
//       <span className="span">Don't have an account? <a href="#">Sign up</a></span>
//     </form>
//   );
// }

// export default LoginPage;


// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // For getting the passed state and navigating
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../utils/firebase"; // import firebase auth
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
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log("User logged in successfully!");
//       // Navigate to the /App route after login
//       navigate('/App');
//     } catch (error) {
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
import { useLocation, useNavigate } from 'react-router-dom'; // For getting the passed state and navigating
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore"; // Firestore imports
import { auth, db } from "../utils/firebase"; // Firebase auth and Firestore imports
import toast from 'react-hot-toast'; // Import for toast notifications
import './LoginPage.css'; // Ensure you have the CSS file here

function LoginPage() {
  
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // Hook to navigate to different routes
  const gender = location.state?.gender || ''; // Extract gender from the location state

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Check if the user exists in the Firestore 'users' collection
      const userDocRef = doc(collection(db, "users"), userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        // User exists in the collection
        toast.success("Login successful! Redirecting...", { position: "top-center" });
        navigate('/Analyze');
      } else {
        // User not found in the Firestore collection
        toast.error("User not found in the database.", { position: "top-center" });
      }
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      toast.error("Error logging in. Please check your credentials.", { position: "top-center" });
      console.error("Error logging in:", error);
    }
  };

  const handleSignUp = () => {
    // Navigate to Register.js and pass gender in the location state
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

      {/* Gender Field */}
      <span className="input-span">
        <label htmlFor="gender" className="label">Gender</label>
        <input 
          type="text" 
          name="gender" 
          id="gender"
          value={gender}
          readOnly // Make it read-only since it's pre-filled
        />
      </span>

      <span className="span"><a href="#">Forgot password?</a></span>
      <input className="submit" type="submit" value="Log in" />
      <span className="span">Don't have an account? <a href="#" onClick={handleSignUp}>Sign up</a></span>
    </form>
  );
}

export default LoginPage;
