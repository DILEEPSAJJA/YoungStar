// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../utils/firebase"; // Import Firebase Firestore
// import { doc, setDoc } from "firebase/firestore"; // Firestore methods to save data
// import toast from 'react-hot-toast';
// import './Register.css';

// function Register() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [gender, setGender] = useState(''); // Gender state
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     // If gender is passed from LoginPage, set it to state
//     if (location.state?.gender) {
//       setGender(location.state.gender);
//     }
//   }, [location.state]);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const userId = userCredential.user.uid;

//       // Add user to Firestore 'users' collection
//       await setDoc(doc(db, "users", userId), {
//         email,
//         gender,
//         createdAt: new Date().toISOString(),
//       });

//       // Show success toast
//       toast.success('Registration successful!', {
//         position: 'top-center',
//         duration: 4000,
//       });

//       // Navigate to /App route
//       navigate('/Analyze');
//     } catch (error) {
//       // Show error toast if registration fails
//       toast.error('Error during registration. Please try again.', {
//         position: 'top-center',
//         duration: 4000,
//       });
//       console.error("Error during registration:", error);
//     }
//   };

//   return (
//     <div className="register-container">
//       <form className="form" onSubmit={handleRegister}>
//         <span className="input-span">
//           <label htmlFor="email" className="label">Email</label>
//           <input 
//             type="email" 
//             name="email" 
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </span>
//         <span className="input-span">
//           <label htmlFor="password" className="label">Password</label>
//           <input 
//             type="password" 
//             name="password" 
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </span>

//         {/* Gender Field */}
//         <span className="input-span">
//           <label htmlFor="gender" className="label">Gender</label>
//           <input 
//             type="text" 
//             name="gender" 
//             id="gender"
//             value={gender}
//             readOnly // Gender is read-only
//           />
//         </span>

//         <input className="submit" type="submit" value="Register" />
//       </form>
//     </div>
//   );
// }

// export default Register;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase"; // Import Firebase Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods to save and check data
import toast from 'react-hot-toast';
import './Register.css';

function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  // States for user input
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // State for the username
  const [interests, setInterests] = useState([]); // State to store selected interests
  const [hobbies, setHobbies] = useState(''); // State for hobbies text
  const [usernameError, setUsernameError] = useState(''); // Error state for username

  // Predefined interests
  const interestOptions = [
    "Music",
    "Sports",
    "Travel",
    "Reading",
    "Gaming",
    "Cooking",
    "Fitness",
    "Art",
  ];

  useEffect(() => {
    // If gender is passed from LoginPage, set it to state
    if (location.state?.gender) {
      setGender(location.state.gender);
    }
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if the username already exists in Firestore
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Username is taken
      setUsernameError('This username is already taken, please choose another.');
      return; // Stop the registration process
    } else {
      setUsernameError(''); // Clear any previous username errors
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Add user to Firestore 'users' collection with unique username
      await setDoc(doc(db, "users", userId), {
        email,
        gender,
        username,
        interests,
        hobbies,
        createdAt: new Date().toISOString(),
      });

      // Show success toast
      toast.success('Registration successful!', {
        position: 'top-center',
        duration: 4000,
      });

      // Navigate to Analyze page for deeper insights or matching
      navigate('/Analyze');
    } catch (error) {
      // Show error toast if registration fails
      toast.error('Error during registration. Please try again.', {
        position: 'top-center',
        duration: 4000,
      });
      console.error("Error during registration:", error);
    }
  };

  const handleInterestChange = (e) => {
    const selectedInterests = Array.from(e.target.selectedOptions, option => option.value);
    setInterests(selectedInterests);
  };

  return (
    <div className="register-container">
      <form className="form" onSubmit={handleRegister}>
        {/* Username Field */}
        <span className="input-span">
          <label htmlFor="username" className="label">Username</label>
          <input 
            type="text" 
            name="username" 
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && <small className="error">{usernameError}</small>} {/* Display error message */}
        </span>

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
            readOnly // Gender is read-only
          />
        </span>

        {/* Interests Field */}
        <span className="input-span">
          <label htmlFor="interests" className="label">Select Your Interests</label>
          <select
            name="interests"
            id="interests"
            multiple
            value={interests}
            onChange={handleInterestChange}
            className="multi-select"
          >
            {interestOptions.map((interest, index) => (
              <option key={index} value={interest}>
                {interest}
              </option>
            ))}
          </select>
          <small className="hint">
            Hold down Ctrl (Windows) or Command (Mac) to select multiple interests.
          </small>
        </span>

        {/* Hobbies Field */}
        <span className="input-span">
          <label htmlFor="hobbies" className="label">Your Hobbies</label>
          <textarea
            name="hobbies"
            id="hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Enter your hobbies, separated by commas."
            rows="3"
          />
        </span>

        <input className="submit" type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
