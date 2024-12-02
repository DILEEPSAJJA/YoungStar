import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';

import LandingPage from './pages/LandingPage';
//import 'react-toastify/dist/ReactToastify.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
  },
  {
    path: "/Login",
    element: <Login/>,
  },
  {
    path: "App",
    element: <App/>,
  },
  {
    path: "home",
    element: <Home/>,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
    <RouterProvider router={router} />
);

