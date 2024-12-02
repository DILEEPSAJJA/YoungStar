// import React, { useState } from 'react';
// import ParticlesComponent from '../components/particle';
// import './Login.css';

// function Login() {
//   const [showTeacherLogin, setShowTeacherLogin] = useState(false);
//   const [showStudentLogin, setShowStudentLogin] = useState(false);

//   const handleTeacherButtonClick = () => {
//     setShowTeacherLogin(!showTeacherLogin);
//     setShowStudentLogin(false); // Ensure student login is hidden
//   };

//   const handleStudentButtonClick = () => {
//     setShowStudentLogin(!showStudentLogin);
//     setShowTeacherLogin(false); // Ensure teacher login is hidden
//   };

//   return (
//     <div className="con" id='chk'>
//       <ParticlesComponent id="particles" />

//       <div className='teacher'>
//         Male <br/><br/><br/>
//         <button className="my-button1" onClick={handleTeacherButtonClick}>Click Me</button>
//       </div>

//       <div className='student'>
//         Female <br/><br/><br/>
//         <button className="my-button1" onClick={handleStudentButtonClick}>Click Me</button>
//       </div>

//       {showTeacherLogin && (
//         <div className={`login-container teacher show`}>
//           <h2>Login</h2>
//           {/* Your teacher login form goes here */}
//           <form>
//             <label>
//               Username:
//               <input type="text" />
//             </label>
//             <label>
//               Password:
//               <input type="password" />
//             </label>
//             <br></br>
//             <button type="submit">Login</button> 
//           </form>
//         </div>
//       )}

//       {showStudentLogin && (
//         <div className={`login-container student show`}>
//           <h2>Login</h2>
//           {/* Your student login form goes here */}
//           <form>
//             <label>
//               Username:
//               <input type="text" />
//             </label>
//             <label>
//               Password:
//               <input type="password" />
//             </label>
//             <br></br>
//             <button type="submit">Login</button> 
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Login;

import React, { useState } from 'react';
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
