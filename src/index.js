import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MyProgress from './pages/MyProgress';
import MyCoachClient from './pages/MyCoachClient';
import CoachLookup from './pages/CoachLookup';
import AccountSettings from './pages/AccountSettings';
import Home from './pages/Home';
import Workouts from './pages/Workouts';

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/my-progress",
        element: <MyProgress/>,
      },
      {
        path: "/workouts",
        element: <Workouts/>,
      },
      {
        path: "/my-coach-client",
        element: <MyCoachClient/>,
      },
      {
        path: "/coach-lookup",
        element: <CoachLookup/>,
      },
      {
        path: "/account-settings",
        element: <AccountSettings/>
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();