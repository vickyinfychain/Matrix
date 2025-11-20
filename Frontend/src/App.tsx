import {  Routes, Route } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/AuthPage";

import { toast, Toaster } from "sonner";
import axios from "axios";
import { useDisconnect } from "wagmi";
import Matrix from "./pages/matrix";
import Dashboard from "./pages/Dashboard";


function App() {
  const { disconnect } = useDisconnect()

  axios.interceptors.request.use(
    (config) => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        config.headers['x-session-token'] = sessionToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  // Response Interceptor: Handle session expiration or invalid token
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear session and redirect to login page
        toast.error('Session expired or logged in from another device.');
        disconnect()
        localStorage.clear()
        // window.location.href = '/'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );


  return (
    <>
        <div className="mx-auto min-h-screen bg-[#0F192D]">

          {/* Routes */}
          
          <Routes>
          
            {/* Public/Auth Pages */}
            <Route path="/" element={<AuthPage />} />
                       <Route path="/matrix" element={<Matrix />} />
                                              <Route path="/Dashboard" element={<Dashboard />} />

          </Routes>
        </div>
      
      <Toaster />
    </>
  );
}

export default App;


