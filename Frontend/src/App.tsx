import { Routes, Route } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/AuthPage";

import { toast, Toaster } from "sonner";
import axios from "axios";
import { useDisconnect } from "wagmi";
import Dashboard from "./pages/Dashboard";
import MatrixPage from "./pages/Matrix";

function App() {
  const { disconnect } = useDisconnect();

  axios.interceptors.request.use(
    (config) => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        config.headers["x-session-token"] = sessionToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired or logged in from another device.");
        disconnect();
        localStorage.clear();
      }
      return Promise.reject(error);
    }
  );

  return (
    <>
      <div className="mx-auto min-h-screen bg-[#0F192D]">
        <Routes>
          {/* Public */}
          <Route path="/" element={<AuthPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Matrix Routes */}
          <Route path="/matrix" element={<MatrixPage />} />
          <Route path="/matrix/:slotNumber" element={<MatrixPage />} />
          {/* Support matrix view for slots for a specific userId */}
          <Route path="/matrix/:slotNumber/:userId" element={<MatrixPage />} />
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
