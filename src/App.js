// import './App.css';
// import './pages/Login.css'
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ParticlesComponent from './components/particle';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import Login from "./pages/Login";
// import SideBar from "./components/SideBar/SideBar";
// import Dashboard from './pages/Dashboard';
// import Users from "./pages/Users";
// import Messages from "./pages/Messages";
// import FileManager from "./pages/FileManager";
// import Analytics from "./pages/Analytics";
// import Order from "./pages/Order";
// import Saved from "./pages/Saved";
// import Register from './pages/Register';
// import Setting from "./pages/Setting";
// import { Toaster } from 'react-hot-toast';
// import Analyze from "./pages/Analyze"; 
// import Home from "./pages/Home";

// function App() {
//   return (
//     <div className="App">
//       <ParticlesComponent id="particles" />
//       <Toaster />
//       <Router>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/loginPage" element={<LoginPage />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/analyze" element={<Analyze />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/app/*" element={<AuthenticatedApp />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// function AuthenticatedApp() {
//   return (
//     <SideBar>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/users" element={<Users />} />
//         <Route path="/messages" element={<Messages />} />
//         <Route path="/analytics" element={<Analytics />} />
//         <Route path="/file-manager" element={<FileManager />} />
//         <Route path="/order" element={<Order />} />
//         <Route path="/saved" element={<Saved />} />
//         <Route path="/settings" element={<Setting />} />
//       </Routes>
//     </SideBar>
//   );
// }

// export default App;


import './App.css';
import './pages/Login.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ParticlesComponent from './components/particle';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Login from "./pages/Login";
import SideBar from "./components/SideBar/SideBar";
import Dashboard from './pages/Dashboard';
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import FileManager from "./pages/FileManager";
import Analytics from "./pages/Analytics";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Register from './pages/Register';
import Setting from "./pages/Setting";
import { Toaster } from 'react-hot-toast';
import Analyze from "./pages/Analyze";
import Home from "./pages/Home";
import Room from './pages/Room';
import 'react-toastify/dist/ReactToastify.css';
// import VideoRoom from './pages/VideoRoom';


function App() {
  return (
    <div className="App">
      <ParticlesComponent id="particles" />
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          {/* <Route path="/videoRoom/:roomId" element={<VideoRoom />} /> */}
          {/* Protected Routes */}
          <Route path="/app/*" element={<AuthenticatedApp />} />
        </Routes>
      </Router>
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <SideBar>
      <div className="authenticated-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/order" element={<Order />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Setting />} />
        </Routes>
      </div>
    </SideBar>
  );
}

export default App;
