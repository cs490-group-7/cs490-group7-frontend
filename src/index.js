
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MyProgress from './pages/MyProgress';
import MyCoachClient from './pages/MyCoachClient';
import MyClients from './pages/MyClients';
import CoachLookup from './pages/CoachLookup';
import AccountSettings from './pages/AccountSettings';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';
import InitialSurvey from './pages/InitialSurvey';
import CoachSurvey from './pages/CoachSurvey';
import { AuthProvider } from './components/AuthContext';
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
        path: "/my-clients",
        element: <MyClients/>,
      },
      {
        path: "/coach-lookup",
        element: <CoachLookup/>,
      },
      {
        path: "/account-settings",
        element: <AccountSettings/>
      },
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path: "/register",
        element: <CreateAccountPage/>
      },
      {
        path: "/initial-survey", 
        element: <InitialSurvey/>
      },
      {
        path: "/coach-survey",
        element: <CoachSurvey/>
      }
      
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();