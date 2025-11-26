import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import Header from "./Header";
import axios from "axios";
import { FaLock, FaShoppingCart } from "react-icons/fa";
import { DollarSign, BarChart3, TrendingUp } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// SnowFall Component
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
            top: "-20px",
            opacity: flake.opacity,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: ["-10%", "110%"],
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
            width: "1px",
            height: "1px",
            left: `${Math.random() * 100}%`,
            top: "-10px",
          }}
          animate={{
            y: ["-5%", "105%"],
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

// MatrixIcons Component
const MatrixIcons: React.FC = () => {
  const icons = [
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      x: "15%",
      y: "15%",
      color: "text-orange-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      x: "50%",
      y: "15%",
      color: "text-amber-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      ),
      x: "85%",
      y: "15%",
      color: "text-yellow-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      x: "15%",
      y: "50%",
      color: "text-orange-300",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      x: "50%",
      y: "50%",
      color: "text-amber-300",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
      x: "85%",
      y: "50%",
      color: "text-yellow-300",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      ),
      x: "15%",
      y: "85%",
      color: "text-orange-500",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      ),
      x: "50%",
      y: "85%",
      color: "text-amber-500",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      x: "85%",
      y: "85%",
      color: "text-yellow-500",
    },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute opacity-20 ${item.color}`}
          style={{
            left: item.x,
            top: item.y,
            transform: "translate(-50%, -50%)",
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
            ease: "easeInOut",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-2/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transform -translate-y-1/2" />
        <div className="absolute left-1/3 top-1/6 bottom-1/6 w-0.5 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-x-1/2" />
        <div className="absolute left-2/3 top-1/6 bottom-1/6 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent transform -translate-x-1/2" />
      </div>
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-amber-400/40 rounded-full"
          style={{
            left: `${5 + ((i * 4) % 90)}%`,
            top: `${5 + ((i * 6) % 90)}%`,
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

// Axios API functions for Dashboard
const dashboardApiService = {
  // Get dashboard data
  getDashboard: async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch dashboard data"
      );
    }
  },
  getEarnings: async (userId: string, limit: number = 50) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/${userId}/earnings`,
        { params: { limit } }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch earnings"
      );
    }
  },
  // Get all slots
  getSlots: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/slots`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to fetch slots");
    }
  },

  // Activate slot
  activateSlot: async (walletAddress: string, slotNumber: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/slots/activate`, {
        walletAddress,
        slotNumber,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to activate slot");
    }
  },

  // Get matrix positions for user
  getMatrixPositions: async (userId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/matrix/all`, {
        userId: userId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch matrix positions"
      );
    }
  },

  // Claim Dividend
  claimDividend: async (userId: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/slots/dividend/claim`, {
        userId,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to claim dividend"
      );
    }
  },
};

const BuySlotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  slotData: any;
  onActivate: () => void;
  onActivateUsingDividend: () => void;
  isLoading: boolean;
  userStats: any;
}> = ({
  isOpen,
  onClose,
  slotData,
  onActivate,
  onActivateUsingDividend,
  isLoading,
  userStats,
}) => {
  if (!isOpen || !slotData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md"
      >
        {/* GLOW BACKGROUND */}
        <div className="absolute -inset-6 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 rounded-3xl blur-2xl opacity-30" />

        {/* MAIN CARD */}
        <div className="relative bg-gray-900/95 rounded-3xl border border-orange-500/40 shadow-[0_0_40px_rgba(255,153,51,0.25)] overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 p-6 text-center relative">
            <div className="absolute inset-0 bg-black/10" />
            <h2 className="relative z-10 text-3xl font-extrabold text-white drop-shadow-lg">
              Activate Slot {slotData.id}
            </h2>
            <p className="relative z-10 text-orange-100 text-sm mt-1">
              Unlock earnings & matrix growth instantly
            </p>
          </div>

          <div className="p-6">
            {/* SLOT INFO CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-800/50 rounded-2xl p-5 border border-orange-500/20 shadow-inner"
            >
              <div className="grid grid-cols-2 gap-5 text-sm">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <div className="text-orange-300/70 text-xs font-medium">
                      Level Number
                    </div>
                    <div className="text-white font-semibold text-lg mt-1">
                      #{slotData.id}
                    </div>
                  </div>

                  <div>
                    <div className="text-orange-300/70 text-xs font-medium">
                      USD Cost
                    </div>
                    <div className="text-white font-semibold text-lg mt-1">
                      ${slotData.priceUSD}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <div className="text-orange-300/70 text-xs font-medium">
                      Your Dividend
                    </div>
                    <div className="text-yellow-400 font-bold text-lg mt-1 drop-shadow">
                      ${userStats?.totalDividend?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mt-6"
            >
              {/* NORMAL ACTIVATE */}
              <motion.button
                onClick={onActivate}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 
            hover:from-orange-600 hover:to-amber-600 rounded-xl font-bold text-white 
            shadow-lg shadow-orange-500/30 relative overflow-hidden disabled:opacity-60"
                whileHover={{ scale: isLoading ? 1 : 1.03 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Activating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Activate Now
                    </>
                  )}
                </span>
              </motion.button>

              {/* DIVIDEND ACTIVATE */}
              <motion.button
                onClick={onActivateUsingDividend}
                disabled={
                  userStats.totalDividend < slotData.priceUSD || isLoading
                }
                className={`
              w-full py-4 rounded-xl font-bold shadow-lg relative overflow-hidden 
              ${
                userStats.totalDividend >= slotData.priceUSD && !isLoading
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900"
                  : "bg-gray-700 text-gray-300 cursor-not-allowed"
              }
            `}
                whileHover={
                  userStats.totalDividend >= slotData.priceUSD && !isLoading
                    ? { scale: 1.03 }
                    : {}
                }
                whileTap={
                  userStats.totalDividend >= slotData.priceUSD && !isLoading
                    ? { scale: 0.97 }
                    : {}
                }
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                    />
                  </svg>
                  {userStats.totalDividend >= slotData.priceUSD
                    ? "Activate Using Dividend"
                    : "Insufficient Dividend"}
                </span>
              </motion.button>

              {/* CANCEL */}
              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl 
            text-gray-200 font-semibold border border-gray-600"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </div>

          {/* CORNER LIGHTS */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/20 blur-2xl" />
        </div>
      </motion.div>
    </div>
  );
};

const EarningsTable: React.FC<{ earnings: any[]; isLoading: boolean }> = ({
  earnings,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(earnings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEarnings = earnings.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (d: string) => {
    const date = new Date(d);

    if (isMobile) {
      // Mobile: Very compact format
      return date
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    }

    // Desktop: Full format
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("direct")) return "🟢";
    if (typeLower.includes("level")) return "🔵";
    if (typeLower.includes("bonus")) return "🟣";
    return "🟠";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-orange-200 text-lg font-medium">
            Loading earnings data...
          </span>
        </div>
      </div>
    );
  }

  if (earnings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative mb-6 group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div
          className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
          }}
        >
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-orange-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-amber-200/80 text-sm sm:text-base mb-2">
              No earnings recorded yet
            </p>
            <p className="text-amber-200/50 text-xs sm:text-sm">
              Your earnings will appear here once you start earning
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative mb-6 group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
      <div
        className="relative rounded-3xl p-3 sm:p-6 border border-orange-500/30 shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Earnings History
          </h3>
        </div>

        {/* Summary Cards - Enhanced Responsive Design */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {[
            {
              name: "Total Earnings",
              amount: earnings.reduce((sum, e) => sum + (e.amountUSD || 0), 0),
              type: "total",
              icon: DollarSign,
              description: "Lifetime earnings",
            },
            {
              name: "Total Transactions",
              amount: earnings.length,
              type: "count",
              icon: BarChart3,
              description: "All-time transactions",
            },
            {
              name: "Average per Transaction",
              amount:
                earnings.length > 0
                  ? earnings.reduce((sum, e) => sum + (e.amountUSD || 0), 0) /
                    earnings.length
                  : 0,
              type: "average",
              icon: TrendingUp,
              description: "Average earnings per transaction",
            },
          ].map((card, index) => {
            const IconComponent = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group/card"
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              >
                {/* Background Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl sm:rounded-3xl blur opacity-0 group-hover/card:opacity-30 transition-opacity duration-300" />

                {/* Card Container */}
                <div
                  className="relative p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-orange-500/30 shadow-lg sm:shadow-xl overflow-hidden h-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
                  }}
                >
                  {/* Background Decorations */}
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-bl from-orange-500/15 to-transparent rounded-full blur-lg sm:blur-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-md" />

                  <div className="relative">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Icon */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-orange-500/30">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-300" />
                        </div>

                        {/* Title */}
                        <div>
                          <div className="text-orange-300/80 font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                            {card.name}
                          </div>
                          <div className="text-orange-400/60 text-xs hidden sm:block">
                            {card.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount Section */}
                    <div className="mb-2 sm:mb-3">
                      <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent leading-tight">
                        {card.type === "count" ? (
                          <span className="flex items-baseline gap-1">
                            {card.amount.toLocaleString()}
                            <span className="text-amber-300 text-sm sm:text-base lg:text-lg">
                              Transactions
                            </span>
                          </span>
                        ) : (
                          formatAmount(card.amount)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Table Container */}
        <div className="relative group/table">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 group-hover/table:opacity-30 transition-opacity" />
          <div
            className="relative rounded-3xl p-2 sm:p-4 md:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-2xl" />

            {/* Desktop Table */}
            {!isMobile ? (
              <div className="relative">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-amber-500/5">
                      <th className="px-4 py-3 text-center text-xs font-semibold text-amber-200 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-amber-200 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-amber-200 uppercase tracking-wider">
                        Slot
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-amber-200 uppercase tracking-wider">
                        From User
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-amber-200 uppercase tracking-wider">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-500/10">
                    {currentEarnings.map((e, index) => (
                      <motion.tr
                        key={e._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-amber-500/5 transition-all duration-300 group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                e.type?.toLowerCase().includes("direct")
                                  ? "bg-green-400"
                                  : e.type?.toLowerCase().includes("level")
                                  ? "bg-blue-400"
                                  : e.type?.toLowerCase().includes("bonus")
                                  ? "bg-purple-400"
                                  : "bg-orange-400"
                              }`}
                            />
                            <span className="text-white text-sm font-medium group-hover:text-amber-100 transition-colors text-center">
                              {e.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-green-400 font-bold text-sm text-center">
                              {formatAmount(e.amountUSD)}
                            </span>
                            <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-60" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                              <svg
                                className="w-3 h-3 text-amber-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-amber-100 font-semibold text-xs text-center">
                                Slot {e.slot?.slotNumber || e.slotNumber}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {e.sourcePosition?.userId ? (
                              <>
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                <span className="text-amber-200 text-sm font-medium text-center">
                                  User #{e.sourcePosition.userId}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400 italic text-sm text-center">
                                System
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-amber-200/70 text-sm font-medium text-center">
                            {formatDate(e.createdAt)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Mobile Cards - Proper layout */
              <div className="space-y-3">
                {currentEarnings.map((e, index) => (
                  <motion.div
                    key={e._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gray-800/50 rounded-2xl p-3 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
                  >
                    {/* Top Row: Type, Amount, and Slot */}
                    <div className="flex justify-between items-start mb-3">
                      {/* Left: Type and Amount */}
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">{getTypeIcon(e.type)}</span>
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {e.type}
                          </div>
                          <div className="text-green-400 font-bold text-base">
                            {formatAmount(e.amountUSD)}
                          </div>
                        </div>
                      </div>

                      {/* Right: Slot Badge */}
                      <span className="inline-flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full border border-orange-500/30 shrink-0">
                        <svg
                          className="w-3 h-3 text-amber-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-amber-100 font-semibold text-xs">
                          {e.slot?.slotNumber || e.slotNumber}
                        </span>
                      </span>
                    </div>

                    {/* Bottom Row: From User and Date */}
                    <div className="flex justify-between items-center">
                      {/* Left: From User */}
                      <div className="flex items-center gap-2">
                        {e.sourcePosition?.userId ? (
                          <>
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            <span className="text-amber-200 text-xs">
                              User #{e.sourcePosition.userId}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-xs">
                            System
                          </span>
                        )}
                      </div>

                      {/* Right: Date */}
                      <div className="text-amber-200/70 text-xs">
                        {formatDate(e.createdAt)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-4 sm:mt-6 group/pagination"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-20 group-hover/pagination:opacity-30 transition-opacity" />
            <div
              className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border border-orange-500/30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
              }}
            >
              {/* Page Info */}
              <div className="text-xs sm:text-sm text-amber-200/70 text-center sm:text-left">
                Showing{" "}
                <span className="font-semibold text-amber-200">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-amber-200">
                  {Math.min(startIndex + itemsPerPage, earnings.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-amber-200">
                  {earnings.length}
                </span>{" "}
                results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 group-hover:text-amber-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-orange-200 text-xs sm:text-sm group-hover:text-amber-100 transition-colors">
                    {isMobile ? "Prev" : "Previous"}
                  </span>
                </button>

                {/* Page Numbers - Compact on mobile */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(isMobile ? 3 : 5, totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= (isMobile ? 3 : 5)) {
                        pageNum = i + 1;
                      } else if (currentPage <= 2) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 1) {
                        pageNum = totalPages - (isMobile ? 2 : 4) + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border transition-all duration-200 font-semibold text-xs sm:text-sm ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg shadow-orange-500/25"
                              : "border-orange-500/30 text-amber-200/70 hover:bg-orange-500/10 hover:text-amber-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                >
                  <span className="text-orange-200 text-xs sm:text-sm group-hover:text-amber-100 transition-colors">
                    {isMobile ? "Next" : "Next"}
                  </span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 group-hover:text-amber-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [activatingSlot, setActivatingSlot] = useState<number | null>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [matrixPositions, setMatrixPositions] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastUsersPerSlot, setLastUsersPerSlot] = useState<{
    [key: string]: number[];
  }>({});

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAmount, setClaimAmount] = useState(0);

  // Mouse move effect for 3D cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Derived flags
  const myUserId = localStorage.getItem("userId");
  const viewUserId = localStorage.getItem("viewUserId");
  const isViewMode = !!viewUserId && viewUserId !== myUserId;
  const isViewOnly = !!viewUserId;

  useEffect(() => {
    const viewUserId = localStorage.getItem("viewUserId");
    const storedUserId = localStorage.getItem("userId");
    const targetUserId = viewUserId || storedUserId;
    if (targetUserId) {
      setUserId(targetUserId);
      loadEarningsData(targetUserId);
    }
  }, []);

  const handleClaimDividendAmount = async () => {
    try {
      if (!claimAmount || claimAmount <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      setIsBooking(true);

      const res = await axios.post(`${API_BASE_URL}/slots/dividend/claim`, {
        userId,
        amount: Number(claimAmount),
      });

      toast.success(res.data.message || "Dividend claimed!");

      setShowClaimModal(false);
      setClaimAmount(0);

      loadDashboardData(userId);
      loadEarningsData(userId);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to claim dividend");
    } finally {
      setIsBooking(false);
    }
  };

  const onActivateUsingDividend = async () => {
    try {
      setIsBooking(true);

      const wallet = localStorage.getItem("walletAddress");
      if (!wallet) {
        toast.error("Wallet not found");
        return;
      }

      toast.success("Activated using Dividend!");

      setShowSlotModal(false);
      loadDashboardData(userId);
      fetchMatrixPositions();
    } catch (error) {
      toast.error("Failed to activate using dividend");
    } finally {
      setIsBooking(false);
    }
  };
  // Fetch matrix positions for the current user
  const fetchMatrixPositions = async () => {
    try {
      const viewUserId = localStorage.getItem("viewUserId");
      const storedUserId = localStorage.getItem("userId");
      const targetUserId = viewUserId || storedUserId;
      if (!targetUserId) {
        console.error("No userId found in localStorage or viewUserId");
        return;
      }

      const matrixData = await dashboardApiService.getMatrixPositions(
        parseInt(targetUserId)
      );
      console.log("Matrix API Response:", matrixData);

      setMatrixPositions(matrixData.positions || []);
      // Update to use the levelOneUserIdsPerSlot from the backend response
      setLastUsersPerSlot(matrixData.summary?.levelOneUserIdsPerSlot || {});
    } catch (error) {
      console.error("Failed to fetch matrix positions:", error);
      toast.error("Failed to load matrix data");
    }
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    const storedWallet = localStorage.getItem("walletAddress");
    const viewUserId = localStorage.getItem("viewUserId");
    const storedUserId = localStorage.getItem("userId");
    const targetUserId = viewUserId || storedUserId;

    // allow viewing dashboard if either a session token is present (search-based login), wallet is connected, or in view-only mode
    if (!sessionToken && !isConnected && !viewUserId) {
      navigate("/");
      return;
    }

    if (storedWallet) setWalletAddress(storedWallet);
    if (targetUserId) {
      setUserId(targetUserId);
      loadDashboardData(targetUserId);
    }

    loadSlots();
    fetchMatrixPositions();
  }, [navigate, isConnected]);

  const loadEarningsData = async (uid: string, limit: number = 50) => {
    try {
      setEarningsLoading(true);
      const data = await dashboardApiService.getEarnings(uid, limit);
      setEarnings(data);
    } catch (err) {
      toast.error("Failed to load earnings");
    } finally {
      setEarningsLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      setLoading(true);
      const data = await dashboardApiService.getDashboard(userId);
      setDashboardData(data);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async () => {
    try {
      setLevelsLoading(true);
      const slotsData = await dashboardApiService.getSlots();
      setSlots(slotsData);
    } catch (error: any) {
      toast.error("Failed to load slots");
      console.error("Slots loading error:", error);
    } finally {
      setLevelsLoading(false);
    }
  };

  // New function to handle slot activation from level cards
  const handleSlotActivation = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    setActivatingSlot(selectedSlot.id);

    // Prevent activations in view-only mode
    if (isViewMode) {
      toast.info(
        "You are viewing another user's account. Slot activation is disabled in view-only mode."
      );
      setIsBooking(false);
      setActivatingSlot(null);
      return;
    }
    try {
      const wallet = localStorage.getItem("walletAddress");
      if (!wallet) {
        toast.error("Wallet not found");
        return;
      }

      await dashboardApiService.activateSlot(wallet, selectedSlot.id);
      toast.success(`Slot ${selectedSlot.id} activated successfully!`);

      setShowSlotModal(false);
      setActivatingSlot(null);

      await loadDashboardData(userId);
      await loadSlots();
      await fetchMatrixPositions(); // Refresh the matrix data and last user IDs
    } catch (error: any) {
      toast.error(error.message || "Failed to activate slot");
      setActivatingSlot(null);
    } finally {
      setIsBooking(false);
    }
  };

  // Transform backend slots to frontend levels format
  const transformSlotsToLevels = (slotsData: any[]) => {
    return slotsData.map((slot) => {
      const userSlot = dashboardData?.slots?.find(
        (s: any) => s.slotNumber === slot.slotNumber
      );

      const isActive = !!userSlot;

      // Check previous slot status
      const previousSlotActive =
        slot.slotNumber === 1 ||
        dashboardData?.slots?.some(
          (s: any) =>
            s.slotNumber === slot.slotNumber - 1 && s.isActive === true
        );

      // Determine slot state
      let state: "ACTIVE" | "READY" | "LOCKED" = "LOCKED";
      if (isActive) state = "ACTIVE";
      else if (previousSlotActive) state = "READY";
      else state = "LOCKED";

      const matrixPosition = matrixPositions.find(
        (pos) =>
          pos.userId === parseInt(userId) && pos.slotNumber === slot.slotNumber
      );

      const actualChildrenCount = matrixPosition?.children?.length || 0;

      return {
        id: slot.slotNumber,
        cost: `$${slot.priceUSD}`,
        priceUSD: slot.priceUSD,
        filled: isActive ? Math.min(3, actualChildrenCount) : 0,
        state,
        isActive,
        // Add last users for this specific slot from the matrix data
        lastUsers: lastUsersPerSlot[slot.slotNumber] || [],
      };
    });
  };

  const levels = transformSlotsToLevels(slots);

  // Automatically determine visible levels - show next batch only when ALL levels in current batch are ACTIVE
  const getVisibleLevels = () => {
    // Always show at least batch 1 (levels 1-5)
    let batchesToShow = 1;

    // Find the current completed batch
    for (let batch = 1; batch <= Math.ceil(levels.length / 5); batch++) {
      const batchStart = (batch - 1) * 5 + 1;
      const batchEnd = batch * 5;
      const batchLevels = levels.filter(
        (lvl) => lvl.id >= batchStart && lvl.id <= batchEnd
      );

      // Check if ALL levels in this batch are ACTIVE (not just READY or not LOCKED)
      const isBatchCompleted = batchLevels.every(
        (lvl) => lvl.state === "ACTIVE"
      );

      if (isBatchCompleted) {
        batchesToShow = batch + 1; // Show this batch + next batch
      } else {
        // Stop when we find a batch that is not fully completed
        break;
      }
    }

    const maxVisible = batchesToShow * 5;
    return levels.slice(0, Math.min(maxVisible, levels.length));
  };

  const visibleLevels = getVisibleLevels();

  // Use actual data from backend or fallback to mock data
  const userStats = dashboardData
    ? {
        id: dashboardData.user?.userId?.toString() || userId,
        totalEarnings: dashboardData.stats?.totalEarned || 0,
        totalDividend: dashboardData.stats.dividendTotal, // 👈 ADD THIS

        levels:
          dashboardData.slots?.map((slot: any, index: number) => ({
            level: index + 1,
            tip: slot.totalEarned || 0,
            percentage: Math.min(
              100,
              ((slot.totalEarned || 0) / slot.roiCap) * 100
            ),
            isActive: slot.isActive,
          })) || [],
      }
    : {
        id: userId || "487498",
        totalEarnings: 0,
        levels: [],
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white font-sans overflow-hidden relative">
      {/* SnowFall and MatrixIcons Components */}
      <SnowFall />
      <MatrixIcons />

      <Header userStats={userStats} walletAddress={walletAddress} />

      {/* View-only indicator */}
      {isViewMode && (
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 relative z-10">
          <div className="flex items-center justify-between bg-amber-900/10 border border-amber-500/20 rounded-xl p-3">
            <div className="text-amber-200 text-sm">
              Viewing user ID <span className="font-semibold">#{userId}</span>{" "}
              (view-only)
            </div>
            <div>
              <button
                onClick={() => {
                  localStorage.removeItem("viewUserId");
                  // If we have a logged-in user (my own account), navigate to their dashboard; otherwise go to root
                  const myId = localStorage.getItem("userId");
                  if (myId) {
                    setUserId(myId);
                    loadDashboardData(myId);
                    loadEarningsData(myId);
                    fetchMatrixPositions();
                    navigate("/dashboard");
                  } else {
                    navigate("/");
                  }
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600"
              >
                Return to My Account
              </button>
            </div>
          </div>
        </div>
      )}

      <BuySlotModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        slotData={selectedSlot}
        onActivate={handleSlotActivation}
        onActivateUsingDividend={onActivateUsingDividend}
        isLoading={isBooking}
        userStats={userStats}
      />
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            {/* Glow Background Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-yellow-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Header with Gradient */}
              <div className="relative bg-gradient-to-r from-yellow-600 via-amber-500 to-orange-500 p-6 text-center overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Header Content */}
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    Claim Dividend
                  </h2>
                  <p className="text-amber-100/80 text-sm">
                    Withdraw your dividend earnings to your account
                  </p>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 space-y-6">
                {/* Available Balance Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800/50 rounded-2xl p-4 border border-amber-500/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-amber-300/70 text-sm font-medium mb-1">
                        Available Balance
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ${userStats.totalDividend?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                      <svg
                        className="w-6 h-6 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Amount Input Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <label className="text-amber-200 text-sm font-semibold flex items-center gap-2">
                    <DollarSign size={16} className="text-amber-300" />
                    Claim Amount
                  </label>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-semibold">
                      $
                    </div>
                    <input
                      type="number"
                      value={claimAmount || ""}
                      onChange={(e) => setClaimAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-24 py-4 rounded-xl bg-gray-800/80 border border-amber-500/30 text-white placeholder-amber-200/40 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 backdrop-blur-sm"
                      placeholder="0.00"
                      min="0"
                      max={userStats.totalDividend}
                      step="0.01"
                    />
                    <button
                      onClick={() => setClaimAmount(userStats.totalDividend)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-lg font-bold hover:from-amber-400 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-amber-500/25"
                    >
                      MAX
                    </button>
                  </div>

                  {/* Validation Messages */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    {claimAmount > userStats.totalDividend && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Amount exceeds available dividend
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-2"
                >
                  <motion.button
                    onClick={() => {
                      setShowClaimModal(false);
                      setClaimAmount(0);
                    }}
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-gray-200 border border-gray-600 transition-all duration-200 flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </motion.button>

                  <motion.button
                    onClick={handleClaimDividendAmount}
                    disabled={
                      isBooking ||
                      !claimAmount ||
                      claimAmount <= 0 ||
                      claimAmount > userStats.totalDividend
                    }
                    className={`
                flex-1 py-4 rounded-xl font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  claimAmount > 0 &&
                  claimAmount <= userStats.totalDividend &&
                  !isBooking
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-105"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }
              `}
                    whileHover={
                      claimAmount > 0 &&
                      claimAmount <= userStats.totalDividend &&
                      !isBooking
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    {isBooking ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Confirm Claim
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </motion.div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800/90 p-6 rounded-2xl border border-orange-500/30"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-orange-200">Loading dashboard...</span>
            </div>
          </motion.div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #FF9933, transparent 70%)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #FFB366, transparent 70%)",
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        {/* Dashboard Stats Cards */}
        
<div className="grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateX(${
                mousePosition.y * 2
              }deg) rotateY(${mousePosition.x * 2}deg)`,
            }}
          >
            <div
              className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-orange-300/70 text-xs sm:text-sm font-medium">
                    Total Earnings
                  </div>
                </div>
                <motion.div
                  className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  ${userStats.totalEarnings.toLocaleString()}
                </motion.div>
                <div className="text-amber-300/70 text-xs sm:text-sm font-medium">
                  LifeTime Earning
                </div>
              </div>
            </div>
          </motion.div>
          {/* Dividend Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateX(${
                mousePosition.y * 2
              }deg) rotateY(${mousePosition.x * 2}deg)`,
            }}
          >
            <div
              className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" />

              <div className="relative">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v8m-4-4h8m6 0a10 10 0 11-20 0 10 10 0 0120 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-amber-300/70 text-xs sm:text-sm font-medium">
                      Dividend Earned
                    </div>
                  </div>

                  {/* Claim Button - Small and integrated */}
                  <motion.button
                    onClick={() => !isViewOnly && setShowClaimModal(true)}
                    disabled={
                      isBooking || userStats.totalDividend <= 0 || isViewOnly
                    }
                    className={`px-4 py-2 mt-2 rounded-lg text-sm font-semibold shadow-md transition-all
                            ${
                              !isViewOnly && userStats.totalDividend > 0 && !isBooking
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:scale-105"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }
                          `}
                  >
                    {isViewOnly
                      ? "Claim"
                      : isBooking
                      ? "Processing..."
                      : "Claim"}
                  </motion.button>
                </div>

                {/* Dividend Amount */}
                <motion.div
                  className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent mb-1 sm:mb-2"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  ${userStats.totalDividend?.toFixed(2) || "0.00"}
                </motion.div>

                {/* Status Text */}
                <div className="text-yellow-300 text-sm font-semibold">
                  Available for Claim
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Affiliate Link Card */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group col-span-1 lg:col-span-3"
          style={{
            transform: `perspective(1000px) rotateX(${
              mousePosition.y * 2
            }deg) rotateY(${mousePosition.x * 2}deg)`,
          }}
        >
          {/* Card Background */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />

          <div
            className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-orange-500/30 shadow-xl sm:shadow-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
            }}
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl sm:blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-amber-500/15 to-transparent rounded-full blur-lg sm:blur-xl" />

            {/* Content */}
            <div className="relative">
              {/* Header - Stack on mobile, row on larger screens */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent leading-tight">
                      Share & Earn
                    </h3>
                    <p className="text-orange-300/70 text-xs sm:text-sm mt-1 hidden xs:block">
                      Invite friends and earn 15% commission
                    </p>
                  </div>
                </div>
              </div>

              {/* Referral Link Section */}
              <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                {/* Referral Link Box */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/30 shadow-inner bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                    <div className="text-xs sm:text-sm text-orange-200 break-all font-mono bg-black/20 rounded px-3 py-2 sm:px-4 sm:py-3 overflow-x-auto">
                      {window.location.origin}/ref/{userId}
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/ref/${userId}`
                    );
                    toast.success("Referral link copied to clipboard!");
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3 lg:py-3.5 bg-gradient-to-r 
            from-orange-600 to-amber-600 
            hover:from-orange-500 hover:to-amber-500
            text-white font-semibold rounded-lg sm:rounded-xl shadow-lg
            border border-orange-500/30 text-sm sm:text-base
            whitespace-nowrap relative overflow-hidden group/btn
            flex items-center justify-center gap-2 sm:gap-3
            min-w-[120px] sm:min-w-[140px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent 
              via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover/btn:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="truncate">Copy Link</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Platform Levels */}
        <div
          className="relative mt-15 z-10 w-full bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-orange-500/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
          }}
        >
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center text-white mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent text-center sm:text-left"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              MATRIX <span className="text-pink-400">X3</span>
            </motion.div>

            {/* Show progress indicator */}
            <div className="flex items-center gap-4">
              <div className="text-amber-200 text-sm font-semibold">
                Showing {visibleLevels.length} of {levels.length} levels
              </div>
            </div>
          </motion.div>

          {levelsLoading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-orange-200">Loading levels...</span>
              </motion.div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {visibleLevels.map((lvl, index) => (
                  <motion.div
                    key={lvl.id}
                    className="relative backdrop-blur-xl border border-orange-500/30 shadow-2xl rounded-2xl 
                       p-2 sm:p-3 md:p-4 text-white transition-all duration-300 
                       hover:border-amber-400 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => {
                      if (lvl.state === "LOCKED") return;
                      if (lvl.state === "ACTIVE")
                        navigate(`/matrix/${lvl.id}/${userId}`);
                      if (lvl.state === "READY") {
                        if (isViewMode) {
                          toast.info(
                            "You are viewing a user in view-only mode. You cannot activate slots."
                          );
                          return;
                        }
                        setSelectedSlot(lvl);
                        setShowSlotModal(true);
                      }
                    }}
                  >
                    {/* Last Users Indicator - Positioned at top right (only shows if there are users) */}

                    {/* READY OVERLAY - Show shopping cart icon for ready slots */}
                    {lvl.state === "READY" && (
                      <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl 
                    flex flex-col items-center justify-center z-20"
                      >
                        <div className="text-3xl">
                          <FaShoppingCart className="text-green-400 text-4xl" />
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-green-800 font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                          Click to Activate
                        </button>
                      </div>
                    )}

                    {/* LOCKED OVERLAY */}
                    {lvl.state === "LOCKED" && (
                      <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl 
                    flex flex-col items-center justify-center z-20"
                      >
                        <div className="text-3xl">
                          <FaLock className="text-gray-300 text-4xl" />
                        </div>
                        <p className="text-gray-300 text-sm">
                          Complete Slot {lvl.id - 1}
                        </p>
                      </div>
                    )}

                    {/* Header */}
                    <div
                      className={`relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 
                                  font-bold text-center rounded-xl py-1 sm:py-2 text-sm sm:text-base md:text-lg 
                                  overflow-hidden border border-orange-500/50 shadow-lg cursor-pointer 
                                  transition-all duration-200 hover:scale-105 hover:shadow-xl 
                                  ${
                                    lvl.state === "ACTIVE"
                                      ? "ring-2 ring-green-400"
                                      : ""
                                  }`}
                    >
                      {activatingSlot === lvl.id && (
                        <motion.div
                          className="absolute inset-0 bg-orange-600 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </motion.div>
                      )}

                      <span
                        className="absolute left-1 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 
                     text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white"
                      >
                        {lvl.id}
                      </span>

                      <span className="text-white">
                        {activatingSlot === lvl.id ? "Activating..." : lvl.cost}
                      </span>
                    </div>

                    {/* User Circles - Show last 3 user IDs */}
                    <div
                      className="flex justify-center gap-2 sm:gap-3 md:gap-3 mt-6 sm:mt-8 md:mt-10 
              mb-2 sm:mb-3 md:mb-4 relative z-10"
                    >
                      {[0, 1, 2].map((position) => {
                        const userId = lvl.lastUsers[position];
                        const hasUser = !!userId;

                        return (
                          <div
                            key={position}
                            className={`
                              w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9
                              rounded-full border-2 border-amber-400/70 relative
                              before:content-[''] before:absolute
                              before:bottom-full before:left-1/2 before:-translate-x-1/2
                              before:w-[2px] before:h-4 sm:before:h-6 md:before:h-8
                              before:border-l-2 before:border-dashed before:border-amber-400/50
                              ${hasUser ? "bg-amber-400" : "bg-transparent"}
                              transition-all duration-300 ease-in-out
                              flex items-center justify-center
                            `}
                            title={
                              hasUser
                                ? `User #${userId}`
                                : `Position ${position + 1} - Empty`
                            }
                          >
                            {hasUser && (
                              <span className="text-black font-bold text-[10px] sm:text-xs md:text-sm">
                                #{userId}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer status */}
                    <div className="text-center mt-2">
                      {lvl.state === "ACTIVE" && (
                        <span
                          className="text-green-400 text-xs font-semibold bg-green-500/20 
                       px-2 py-1 rounded-full"
                        >
                          Active
                        </span>
                      )}

                      {lvl.state === "READY" && (
                        <span
                          className="text-orange-400 text-xs font-semibold bg-orange-500/20 
                       px-2 py-1 rounded-full"
                        >
                          Ready to Activate
                        </span>
                      )}

                      {lvl.state === "LOCKED" && (
                        <span
                          className="text-gray-400 text-xs font-semibold bg-gray-600/30 
                       px-2 py-1 rounded-full"
                        >
                          Locked
                        </span>
                      )}
                    </div>

                    <div
                      className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                  bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl"
                    />
                  </motion.div>
                ))}
              </div>

              {visibleLevels.length >= levels.length && levels.length > 0 && (
                <motion.div
                  className="text-center mt-3 sm:mt-4 md:mt-6 text-green-400 font-semibold bg-green-500/30 border border-green-500/40 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm md:text-base backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  All levels loaded! ({levels.length} total)
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 relative z-10">
        <div className="mt-8">
          <EarningsTable earnings={earnings} isLoading={earningsLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
