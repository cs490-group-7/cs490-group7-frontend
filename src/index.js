import React, {useContext } from 'react';
import { AuthContext } from './components/AuthContext';
import { Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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
import AdminPage from './pages/AdminPage';
import ClientRequests from './components/ClientRequests';
import ClientDetails from './components/ClientDetails';

const AppRouter = () => {
  const { isAuthenticated, userType} = useContext(AuthContext); 

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
        element: isAuthenticated ? (userType !== 'Coach' ? <MyCoach /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
      },
      {
        path: "/my-clients",
        element: isAuthenticated ? (userType !== 'Client' ? <MyClients /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
      },
      {
        path: "/my-clients/:clientId",
        element: isAuthenticated ? (userType !== 'Client' ? <ClientDetails/> : <Navigate to="/dashboard" />) : <Navigate to="/login" />,
      },
      {
        path: "/my-clients/workouts/:clientId",
        element: isAuthenticated ? (userType !== 'Client' ? <Workouts/> : <Navigate to="/dashboard" />) : <Navigate to="/login" />,
      },
      {
        path:'/my-clients/requests',
        element: isAuthenticated ? (userType !== 'Client' ? <ClientRequests/> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
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
        element: isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage/>
      },
      {
        path: "/register",
        element:  isAuthenticated ? <Navigate to="/dashboard" /> : <CreateAccountPage/>
      },
      {
        path: "/initial-survey", 
        element:  isAuthenticated ? <Navigate to="/dashboard" /> : <InitialSurvey/>
      },
      {
        path: "/coach-survey",
        element:  isAuthenticated ? <Navigate to="/dashboard" /> : <CoachSurvey/>
      },
      {
      path: "/admin",
          element: isAuthenticated ? ((userType !== 'Client' && userType !== 'Coach') ? <AdminPage /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
      },
      
    ]
  },
]);

return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
);
