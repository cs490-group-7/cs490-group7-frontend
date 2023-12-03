
import React, {useContext } from 'react';
import { AuthContext } from './components/AuthContext';
import { Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MyProgress from './pages/MyProgress';
import MyCoach from './pages/MyCoach';
import MyClients from './pages/MyClients';
import CoachLookup from './pages/CoachLookup';
import AccountSettings from './pages/AccountSettings';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';
import InitialSurvey from './pages/InitialSurvey';
import CoachSurvey from './pages/CoachSurvey';
import { AuthProvider } from './components/AuthContext';
import Home from './pages/Home';
import ClientRequests from './components/ClientRequests';
import ClientDetails from './components/ClientDetails';

const AppRouter = () => {
  const { isAuthenticated } = useContext(AuthContext); 

  const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/dashboard",
        element: isAuthenticated ? <Dashboard/> : <Navigate to="/login" />
      },
      {
        path: "/my-progress",
        element:  isAuthenticated ? <MyProgress/> : <Navigate to="/login" />
      },
      {
        path: "/workouts",
        element:  isAuthenticated ? <Workouts/> : <Navigate to="/login" /> 
      },
      {
        path: "/my-coach",
        element: isAuthenticated ? <MyCoach/> : <Navigate to="/login" /> 
      },
      {
        path: "/my-clients",
        element: isAuthenticated ? <MyClients/> : <Navigate to="/login" />,
      },
      {
        path: "/my-clients/:clientId",
        element: isAuthenticated ? <ClientDetails/> : <Navigate to="/login" />,
      },
      {
        path:'/my-clients/requests',
        element: isAuthenticated ? <ClientRequests/> : <Navigate to="/login" />
      },
      {
        path: "/coach-lookup",
        element: isAuthenticated ? <CoachLookup/> : <Navigate to="/login" /> 
      },
      {
        path: "/account-settings",
        element:  isAuthenticated ? <AccountSettings/> : <Navigate to="/login" />
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

return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();