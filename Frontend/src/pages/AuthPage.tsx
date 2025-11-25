import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createAppKit } from "@reown/appkit";
import { bsc } from "@reown/appkit/networks";
import { wagmiAdapter, projectId } from "../config/index";
import { useAccount } from "wagmi";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Session management utilities
const sessionManager = {
  isLoggedIn: () => {
    return !!localStorage.getItem("sessionToken");
  },

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

  createSession: (user: any) => {
    const sessionToken = `session_${Date.now()}_${user.walletAddress}`;
    
    localStorage.setItem("sessionToken", sessionToken);
    localStorage.setItem("userId", String(user.userId));
    localStorage.setItem("walletAddress", user.walletAddress);
    localStorage.setItem("loginTimestamp", Date.now().toString());
    localStorage.removeItem("viewUserId");
    
    return sessionToken;
  },

  createViewSession: (user: any) => {
    localStorage.setItem("viewUserId", String(user.userId));
    return true;
  },

  clearSession: () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("sponsorId");
    localStorage.removeItem("viewUserId");
  },

  validateSession: () => {
    const session = sessionManager.getSession();
    if (!session) return false;

    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (loginTimestamp) {
      const sessionAge = Date.now() - parseInt(loginTimestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (sessionAge > sevenDays) {
        sessionManager.clearSession();
        return false;
      }
    }
    
    return true;
  }
};

// Enhanced BrandMark with futuristic design
const BrandMark: React.FC = () => {
  return (
    <div className="relative mb-8">
      <motion.div
        className="absolute -inset-4 rounded-full blur-2xl opacity-50"
        style={{
          background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700, #FF8C00)",
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 10, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.div
        className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border-2 border-orange-500/50 shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/10" />
        
        {/* Animated hexagon pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-2 border-orange-500/50" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
          </motion.div>
        </div>
        
        <motion.div
          className="absolute inset-0 m-auto w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            boxShadow: "0 0 40px rgba(255, 153, 51, 0.6), inset 0 2px 0 rgba(255,255,255,0.3)"
          }}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-orange-400 rounded-tl-lg" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400 rounded-tr-lg" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-orange-400 rounded-bl-lg" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400 rounded-br-lg" />
      </motion.div>
      
      {/* Orbital rings */}
      <motion.div
        className="absolute inset-0 border-2 border-orange-500/20 rounded-full"
        style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Enhanced particle system
const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.size * 3}px rgba(255, 153, 51, 0.8)`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Futuristic grid background
const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 153, 51, 0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255, 153, 51, 0.5) 2px, transparent 2px)
            `,
            backgroundSize: "80px 80px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "80px 80px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, #FF6B00, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, #FFA500, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 153, 51, 0.3) 2px, rgba(255, 153, 51, 0.3) 4px)",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "0px 100px"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Futuristic Icons
const MatrixIcons: React.FC = () => {
  const icons = [
    { icon: "⬡", x: "10%", y: "15%", color: "text-orange-400" },
    { icon: "◈", x: "25%", y: "25%", color: "text-amber-400" },
    { icon: "⬢", x: "75%", y: "20%", color: "text-yellow-400" },
    { icon: "◆", x: "90%", y: "30%", color: "text-orange-300" },
    { icon: "⬣", x: "15%", y: "70%", color: "text-amber-300" },
    { icon: "◇", x: "85%", y: "75%", color: "text-yellow-300" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute text-6xl opacity-20 ${item.color}`}
          style={{
            left: item.x,
            top: item.y,
            textShadow: "0 0 20px currentColor",
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          {item.icon}
        </motion.div>
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

// API Service
const apiService = {
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
      const res = await apiService.getUserById(Number(searchNumber));
      const user = (res && res.user) ? res.user : res;
      toast.success(`Found user: ${user.walletAddress}`);

      const current = sessionManager.getSession();
      if (current && Number(current.userId) === Number(user.userId)) {
        await loginUser(user);
      } else {
        sessionManager.createViewSession(user);
        toast.success(`You are now viewing user #${user.userId} (view-only)`);
        navigate('/dashboard');
      }
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

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <motion.div
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <motion.div
              className="absolute inset-0 border-4 border-orange-500/30 border-t-orange-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.p 
            className="text-orange-300 font-medium text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Checking session...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4 font-sans overflow-hidden">
      <GridBackground />
      <ParticleField />
      <MatrixIcons />

      {/* Main Container */}
      <motion.div
        className="w-full max-w-7xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Panel - Login */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border-2 border-orange-500/30 shadow-2xl overflow-hidden group"
            style={{ 
              transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`,
              boxShadow: `
                0 0 80px rgba(255, 107, 0, 0.3),
                inset 0 0 80px rgba(255, 107, 0, 0.05),
                0 0 0 1px rgba(255, 153, 51, 0.2)
              `
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 opacity-50">
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(45deg, transparent, rgba(255, 107, 0, 0.3), transparent)",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-orange-500/50 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-orange-500/50 rounded-br-3xl" />

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-8">
                <BrandMark />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-orange-200/80 text-lg font-light tracking-wide">
                    Connect to the future
                  </p>
                </motion.div>
              </div>

              {/* Connection Status */}
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-300 text-sm font-medium">Wallet Connected</span>
                </motion.div>
              )}

              {/* Connect Button */}
              <motion.button
                onClick={handleConnectRegisterLogin}
                disabled={loader}
                className={`w-full mb-6 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                  loader 
                    ? "bg-gray-700/50 cursor-not-allowed text-gray-400" 
                    : "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-orange-500/50"
                }`}
                whileHover={!loader ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loader ? { scale: 0.98 } : {}}
              >
                {!loader && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loader ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : isConnected ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Continue to Dashboard
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </span>
              </motion.button>

              {/* Referral Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="text-orange-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Referral Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    placeholder="Enter referral address..."
                    className="w-full bg-gray-800/60 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white placeholder-orange-300/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all duration-200 backdrop-blur-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-2 h-2 bg-orange-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Status Message */}
              {status && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3"
                >
                  <motion.div
                    className="w-5 h-5 border-3 border-orange-400/30 border-t-orange-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-orange-200 font-medium">{status}</span>
                </motion.div>
              )}

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-orange-300/60 text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                Secured by Web3 Technology
              </motion.div>
            </div>
          </motion.div>

          {/* Right Panel - Search */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border-2 border-amber-500/30 shadow-2xl overflow-hidden group"
            style={{ 
              transform: `perspective(1000px) rotateY(${-mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`,
              boxShadow: `
                0 0 80px rgba(255, 165, 0, 0.3),
                inset 0 0 80px rgba(255, 165, 0, 0.05),
                0 0 0 1px rgba(255, 179, 102, 0.2)
              `
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 opacity-50">
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(-45deg, transparent, rgba(255, 165, 0, 0.3), transparent)",
                }}
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-amber-500/50 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-amber-500/50 rounded-bl-3xl" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Search System
                </h3>
                <p className="text-amber-200/80 text-lg font-light tracking-wide">
                  Find any user instantly
                </p>
              </motion.div>

              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="text-amber-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  User ID Number
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter user ID to search..."
                    className="w-full bg-gray-900/60 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 transition-all duration-200 backdrop-blur-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-amber-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-amber-300/50 text-xs mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Press Enter or click search button
                </p>
              </motion.div>

              {/* Search Button */}
              <motion.button
                onClick={handleSearch}
                disabled={searching}
                className={`w-full mb-6 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                  searching 
                    ? "bg-gray-700/50 cursor-not-allowed text-gray-400" 
                    : "bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/50"
                }`}
                whileHover={!searching ? { scale: 1.02, y: -2 } : {}}
                whileTap={!searching ? { scale: 0.98 } : {}}
              >
                {!searching && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {searching ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search User
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-orange-300/40 text-sm"
        >
          <p>© 2024 Powered by Blockchain Technology • All Rights Reserved</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;