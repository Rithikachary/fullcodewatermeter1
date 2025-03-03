import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import './App.css';
import Dashboard from './Pages/Dashboard';
import SlideBar from './Components/SlideBar';
import NavBar from './Components/NavBar';
import HierarchyTitle from './Pages/HierarchyTitle';
import DataHierarchy from './Pages/DataHierarchy';
import Signup from './Pages/Signup';
// import Server from './Pages/Server';
import Configure from './Pages/Configure';
import MeterMap from './Pages/MeterMap'
import AllMeters from './Pages/AllMeters';
import AddMeter from './Pages/AddMeter';
import Screen from './Pages/Screen';
import MeterDetails from './Pages/MeterDetails';
 



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

 // Layout for Protected Routes
const ProtectedLayout = ({ children }) => (
  <div>
    <NavBar />
    <div>
      <SlideBar />
      <main>{children}</main>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Route */}
          <Route path="" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Dashboard />
                  </ProtectedLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/areamanagement/hierarchytitle"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <HierarchyTitle />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/areamanagement/datahierarchy"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DataHierarchy />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/configure/server"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  {/* <Server /> */}
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure/addmeter"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <AddMeter/>
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/configure/allmeters"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <AllMeters />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/configure/mqtt"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Configure />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/configure/metermap"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <MeterMap />
                  {/* <Screen/> */}
                  {/* <MeterDetails/> */}
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meter-details/:consumerId/:meterId"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
               
                 
                  <MeterDetails/>
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          
          

        </Routes>
      </div>
    </Router>
  );
};

export default App;
