import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createAppKit } from "@reown/appkit";
import { bsc } from "@reown/appkit/networks";
import { wagmiAdapter, projectId } from "../config/index";
import { useAccount, } from "wagmi";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Session management utilities
const sessionManager = {
  // Check if user is already logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("sessionToken");
  },

  // Get current session data
  getSession: () => {
    const sessionToken = localStorage.getItem("sessionToken");
    const userId = localStorage.getItem("userId");
    const walletAddress = localStorage.getItem("walletAddress");
    
    if (sessionToken && userId && walletAddress) {
      return {
        sessionToken,
        userId: parseInt(userId),
        walletAddress
      };
    }
    return null;
  },

  // Create new session
  createSession: (user: any) => {
    const sessionToken = `session_${Date.now()}_${user.walletAddress}`;
    
    localStorage.setItem("sessionToken", sessionToken);
    localStorage.setItem("userId", String(user.userId));
    localStorage.setItem("walletAddress", user.walletAddress);
    localStorage.setItem("loginTimestamp", Date.now().toString());
    
    return sessionToken;
  },

  // Clear session
  clearSession: () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("sponsorId");
  },

  // Validate session (optional: check if session is still valid)
  validateSession: () => {
    const session = sessionManager.getSession();
    if (!session) return false;

    // Optional: Check if session is expired (e.g., 7 days)
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (loginTimestamp) {
      const sessionAge = Date.now() - parseInt(loginTimestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (sessionAge > sevenDays) {
        sessionManager.clearSession();
        return false;
      }
    }
    
    return true;
  }
};

const BrandMark: React.FC = () => {
  return (
    <div className="relative mb-4 sm:mb-6">
      <motion.div
        className="absolute -inset-1 sm:-inset-2 rounded-3xl blur-xl opacity-70"
        style={{
          background: "linear-gradient(135deg, #FF9933, #FFB366, #FFA54D, #FF8C1A)",
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 8, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-orange-500/30 shadow-2xl overflow-hidden">
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ 
            boxShadow: "inset 0 0 0 1px rgba(255, 153, 51, 0.3)",
            background: "linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(255, 179, 102, 0.05))"
          }}
        />
        <motion.div
          className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg"
          initial={{ scale: 0.95, rotate: 0 }}
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            boxShadow: "0 0 30px rgba(255, 153, 51, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
          }}
        />
        <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-orange-500/20 to-transparent" />
      </div>
    </div>
  );
};

const SnowFall: React.FC = () => {
  const snowFlakes = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.7 + 0.3,
    sway: Math.random() * 50 - 25,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {snowFlakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: `${flake.left}%`,
            top: '-20px',
            opacity: flake.opacity,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: ['-10%', '110%'],
            x: [0, flake.sway, 0],
            rotate: [0, 180, 360],
            opacity: [0, flake.opacity, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        />
      ))}
      
      {Array.from({ length: 40 }, (_, i) => (
        <motion.div
          key={`small-${i}`}
          className="absolute rounded-full bg-white/60"
          style={{
            width: '1px',
            height: '1px',
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          animate={{
            y: ['-5%', '105%'],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const MatrixIcons: React.FC = () => {
  const icons = [
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ), 
      x: "15%", 
      y: "15%",
      color: "text-orange-400"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ), 
      x: "50%", 
      y: "15%",
      color: "text-amber-400"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      ), 
      x: "85%", 
      y: "15%",
      color: "text-yellow-400"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ), 
      x: "15%", 
      y: "50%",
      color: "text-orange-300"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ), 
      x: "50%", 
      y: "50%",
      color: "text-amber-300"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      ), 
      x: "85%", 
      y: "50%",
      color: "text-yellow-300"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      ), 
      x: "15%", 
      y: "85%",
      color: "text-orange-500"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      ), 
      x: "50%", 
      y: "85%",
      color: "text-amber-500"
    },
    { 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ), 
      x: "85%", 
      y: "85%",
      color: "text-yellow-500"
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute opacity-30 ${item.color}`}
          style={{
            left: item.x,
            top: item.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          {item.icon}
        </motion.div>
      ))}
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-2/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transform -translate-y-1/2" />
        
        <div className="absolute left-1/3 top-1/6 bottom-1/6 w-0.5 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-x-1/2" />
        <div className="absolute left-2/3 top-1/6 bottom-1/6 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent transform -translate-x-1/2" />
      </div>

      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-amber-400/60 rounded-full"
          style={{
            left: `${5 + (i * 4) % 90}%`,
            top: `${5 + (i * 6) % 90}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 8, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

let appKit: any = null;

const initializeAppKit = () => {
  if (typeof window !== 'undefined' && !appKit) {
    appKit = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [bsc],
      defaultNetwork: bsc,
      features: {
        analytics: true,
        email: false,
        socials: false,
        emailShowWallets: false,
      },
      themeMode: "dark",
    });
  }
  return appKit;
};

// Axios API functions
const apiService = {
  // Get user by wallet address
  getUserByWallet: async (walletAddress: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/by-wallet/${walletAddress}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },

  // Register new user
  registerUser: async (walletAddress: string, sponsorUserId: number | null = null) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        walletAddress,
        sponsorUserId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  },

  // Get user by ID
  getUserById: async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isConnected, address } = useAccount();

  const [referral, setReferral] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pendingAuth, setPendingAuth] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    initializeAppKit();
  }, []);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      if (sessionManager.validateSession()) {
        const session = sessionManager.getSession();
        if (session) {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      }
      setIsCheckingSession(false);
    };

    checkExistingSession();
  }, [navigate]);

  useEffect(() => {
    if (id) setReferral(id);
  }, [id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePosition({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    if (pendingAuth && isConnected && address) {
      void continueAuth(address);
    }
  }, [pendingAuth, isConnected, address]);

  const openReownConnectModal = () => {
    if (appKit) {
      appKit.open();
    } else {
      console.error("Reown AppKit not initialized");
      toast.error("Wallet connection not available. Please refresh the page.");
    }
  };

  const checkUserExist = async (wallet: string) => {
    try {
      const user = await apiService.getUserByWallet(wallet);
      return { exist: true, user };
    } catch (error: any) {
      if (error.message.includes("User not found")) {
        return { exist: false };
      }
      throw error;
    }
  };

  const continueAuth = async (wallet: string) => {
    try {
      setStatus("Checking account...");
      
      const userCheck = await checkUserExist(wallet);
      
      localStorage.setItem("walletAddress", wallet);
      if (referral) {
        localStorage.setItem("sponsorId", referral);
      }

      if (userCheck.exist && userCheck.user) {
        setStatus("Signing in...");
        await loginUser(userCheck.user);
        return;
      }

      setStatus("Creating your account...");
      const newUser = await registerUser(wallet);
      if (!newUser) {
        setStatus("");
        return;
      }
      
      setStatus("Account created. Signing in...");
      await loginUser(newUser);
    } catch (e) {
      console.error(e);
      toast.error("Authentication failed. Try again.");
    } finally {
      setStatus("");
      setPendingAuth(false);
    }
  };

  const handleConnectRegisterLogin = async () => {
    setStatus("");
    if (!isConnected || !address) {
      setPendingAuth(true);
      openReownConnectModal();
      return;
    }
    await continueAuth(address);
  };

  const registerUser = async (wallet: string) => {
    if (!referral) {
      toast.error("Use referral link for registration.");
      return false;
    }

    try {
      setLoader(true);
      const result = await apiService.registerUser(wallet, Number(referral));
      toast.success("Registration successful");
      return result.user;
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      return false;
    } finally {
      setLoader(false);
    }
  };

  const loginUser = async (user: any) => {
    try {
      sessionManager.createSession(user);
      toast.success("Login successful");
      navigate("/dashboard");
      return true;
    } catch (err) {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Please enter a number to search");
      return;
    }
    
    setSearching(true);
    try {
      const user = await apiService.getUserById(Number(searchNumber));
      toast.success(`Found user: ${user.walletAddress}`);
    } catch (error: any) {
      toast.error(error.message || "User not found");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-orange-200">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white p-3 sm:p-4 font-sans overflow-hidden">
      <SnowFall />
      <MatrixIcons />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #FF9933, transparent 70%)"
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #FFB366, transparent 70%)"
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 153, 51, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 153, 51, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-4xl lg:max-w-6xl bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-orange-500/30 relative z-10"
        style={{ 
          transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 0 1px rgba(255, 153, 51, 0.3),
            0 0 40px rgba(255, 153, 51, 0.1)
          `
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          <div className="flex-1 flex flex-col items-center">
            <BrandMark />

            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2 sm:mb-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome Back
            </motion.h2>

            <motion.p
              className="text-orange-200 text-sm sm:text-base mb-4 sm:mb-6 text-center font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connect your wallet to access the platform
            </motion.p>

            <motion.button
              onClick={handleConnectRegisterLogin}
              disabled={loader}
              className={`w-full ${
                loader 
                  ? "bg-orange-700/50 cursor-not-allowed text-orange-300/60" 
                  : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg hover:shadow-orange-500/40"
              } py-3 sm:py-4 rounded-2xl font-semibold mb-4 sm:mb-6 transition-all duration-300 active:scale-95 relative overflow-hidden group border border-orange-500/30 text-sm sm:text-base`}
              whileHover={{ scale: loader ? 1 : 1.02 }}
              whileTap={{ scale: loader ? 1 : 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                {loader ? (
                  <>
                    <motion.div
                      className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/50 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </>
                ) : isConnected ? (
                  "Continue to Dashboard"
                ) : (
                  "Connect Wallet & Login"
                )}
              </span>
            </motion.button>

            <motion.div
              className="w-full mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <label className="text-orange-200 text-xs sm:text-sm mb-2 sm:mb-3 block font-medium">Referral Code</label>
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                placeholder="Enter referral wallet address"
                className="w-full bg-gray-700/60 border border-orange-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))"
                }}
              />
            </motion.div>

            {status && (
              <motion.p
                className="text-center mt-3 sm:mt-4 text-orange-200 font-medium text-xs sm:text-sm bg-orange-900/40 px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full border border-orange-500/25"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {status}
              </motion.p>
            )}

            <motion.p
              className="text-orange-300/70 text-xs mt-3 sm:mt-4 text-center font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Secure authentication powered by Web3 technology
            </motion.p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-0.5 h-48 sm:h-56 md:h-64 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.h3
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-3 sm:mb-4 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Search System
            </motion.h3>

            <motion.p
              className="text-orange-200 text-sm sm:text-base mb-4 sm:mb-6 text-center font-light"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Enter any number to search in the system
            </motion.p>

            <motion.div
              className="w-full mb-4 sm:mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="text-orange-200 text-xs sm:text-sm mb-2 sm:mb-3 block font-medium">
                Enter Number
              </label>
              <input
                type="number"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter any number to search..."
                className="w-full bg-gray-700/60 border border-orange-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))"
                }}
              />
              <p className="text-orange-300/50 text-xs mt-1 sm:mt-2 text-center">
                You can search by entering any number
              </p>
            </motion.div>

            <motion.button
              onClick={handleSearch}
              disabled={searching}
              className={`w-full ${
                searching 
                  ? "bg-orange-700/50 cursor-not-allowed text-orange-300/60" 
                  : "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-amber-500/40"
              } py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 active:scale-95 relative overflow-hidden group border border-amber-500/30 text-sm sm:text-base`}
              whileHover={{ scale: searching ? 1 : 1.02 }}
              whileTap={{ scale: searching ? 1 : 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                {searching ? (
                  <>
                    <motion.div
                      className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/50 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Searching...
                  </>
                ) : (
                  "Search Number"
                )}
              </span>
            </motion.button>

            <motion.div
              className="w-full mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-900/20 rounded-xl border border-amber-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-amber-200 text-xs sm:text-sm text-center">
                Quick search functionality for system numbers
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;