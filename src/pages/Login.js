// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Add this for navigation
// import ParticlesComponent from '../components/particle';
// import './Login.css';

// function Login() {
//   const navigate = useNavigate(); // Initialize useNavigate hook for navigation

//   const handleTeacherButtonClick = () => {
//     navigate("/loginPage", { state: { gender: 'Male' } }); // Pass gender as state to login page
//   };

//   const handleStudentButtonClick = () => {
//     navigate("/loginPage", { state: { gender: 'Female' } }); // Pass gender as state to login page
//   };

//   return (
//     <div className="con" id="chk">
//       <ParticlesComponent id="particles" />
//       <div className="teacher">
//         Male <br /><br /><br />
//         <button className="my-button1" onClick={handleTeacherButtonClick}>Click Me</button>
//       </div>

//       <div className="student">
//         Female <br /><br /><br />
//         <button className="my-button1" onClick={handleStudentButtonClick}>Click Me</button>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this for navigation
import ParticlesComponent from '../components/particle';
import './Login.css';

function Login() {
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const handleTeacherButtonClick = () => {
    navigate("/loginPage", { state: { gender: 'Male' } }); // Pass gender as state to login page
  };

  const handleStudentButtonClick = () => {
    navigate("/loginPage", { state: { gender: 'Female' } }); // Pass gender as state to login page
  };

  return (
    <div className="con" id="chk">
      <ParticlesComponent id="particles" />
      <div className="teacher">
        Male <br /><br /><br />
        <button className="my-button1" onClick={handleTeacherButtonClick}>Click Me</button>
      </div>

      <div className="student">
        Female <br /><br /><br />
        <button className="my-button1" onClick={handleStudentButtonClick}>Click Me</button>
      </div>
    </div>
  );
}

export default Login;
