import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import Header from "./Header";
import axios from "axios";
import { FaLock, FaShoppingCart } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Enhanced Grid Background
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

// Enhanced Particle System
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

// Enhanced MatrixIcons Component
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

// Enhanced BrandMark for Dashboard
const DashboardBrandMark: React.FC = () => {
  return (
    <div className="relative">
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
        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border-2 border-orange-500/50 shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/10" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-10 h-10 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-2 border-orange-500/50" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
          </motion.div>
        </div>
        
        <motion.div
          className="absolute inset-0 m-auto w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg flex items-center justify-center"
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
            boxShadow: "0 0 20px rgba(255, 153, 51, 0.6), inset 0 2px 0 rgba(255,255,255,0.3)"
          }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Axios API functions for Dashboard
const dashboardApiService = {
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
  getSlots: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/slots`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to fetch slots");
    }
  },
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
  getMatrixPositions: async (userId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/matrix/all`, {
        userId: userId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch matrix positions"
      );
    }
  },
};

// Simple LastUsersIndicator component
const LastUsersIndicator: React.FC<{ 
  lastThreeUserIds: number[];
}> = ({ lastThreeUserIds }) => {
  if (lastThreeUserIds.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-orange-400 shadow-lg">
        <div className="text-white font-bold text-xs">
          #{lastThreeUserIds[0]}
        </div>
      </div>
    </div>
  );
};

// Enhanced BuySlotModal
const BuySlotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  slotData: any;
  onActivate: () => void;
  onActivateUsingDividend: () => void;
  isLoading: boolean;
  userStats: any;
}> = ({ isOpen, onClose, slotData, onActivate, onActivateUsingDividend, isLoading, userStats }) => {

  if (!isOpen || !slotData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-3xl border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl opacity-50">
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
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-orange-500/50 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/50 rounded-br-3xl" />

        <div className="relative z-10">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <DashboardBrandMark />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Activate Slot {slotData.id}
            </h2>
          </div>

          {/* Info Box */}
          <div className="bg-gray-800/60 p-4 rounded-2xl border border-orange-500/20 mb-4 backdrop-blur-sm">
            <div className="space-y-2">
              <p className="text-amber-200 flex justify-between">
                <span className="text-orange-300">Slot Number:</span>
                <span className="font-semibold">#{slotData.id}</span>
              </p>
              <p className="text-amber-200 flex justify-between">
                <span className="text-orange-300">Cost:</span>
                <span className="font-semibold">${slotData.priceUSD} USD</span>
              </p>
              <p className="text-amber-200 flex justify-between">
                <span className="text-orange-300">ETH:</span>
                <span className="font-semibold">{slotData.ethCost} ETH</span>
              </p>
              <div className="border-t border-orange-500/20 pt-2">
                <p className="text-amber-300 flex justify-between text-sm">
                  <span className="text-orange-300">Your Dividend:</span>
                  <span className="font-semibold">${userStats?.totalDividend?.toFixed(2) || 0}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 text-amber-100 text-sm mb-6">
            💡 After activation, click the slot card again to view your matrix structure.
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Normal Activation */}
            <motion.button
              onClick={onActivate}
              disabled={isLoading}
              className={`relative py-3 rounded-2xl font-bold text-center w-full transition-all duration-300 overflow-hidden ${
                isLoading 
                  ? "bg-gray-700/50 cursor-not-allowed text-gray-400" 
                  : "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-orange-500/50"
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {!isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative z-10">
                {isLoading ? "Activating..." : "Activate Slot"}
              </span>
            </motion.button>

            {/* Dividend Activation */}
            <motion.button
              onClick={onActivateUsingDividend}
              disabled={userStats.totalDividend < slotData.priceUSD || isLoading}
              className={`relative py-3 rounded-2xl font-bold text-center w-full transition-all duration-300 overflow-hidden ${
                userStats.totalDividend >= slotData.priceUSD && !isLoading
                  ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-gray-900 shadow-lg shadow-yellow-500/50"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              whileHover={userStats.totalDividend >= slotData.priceUSD && !isLoading ? { scale: 1.02 } : {}}
              whileTap={userStats.totalDividend >= slotData.priceUSD && !isLoading ? { scale: 0.98 } : {}}
            >
              {userStats.totalDividend >= slotData.priceUSD && !isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative z-10">
                {userStats.totalDividend >= slotData.priceUSD
                  ? "Activate Using Dividend"
                  : "Not Enough Dividend"}
              </span>
            </motion.button>

            {/* Cancel */}
            <motion.button
              onClick={onClose}
              className="py-2 rounded-2xl bg-gray-700/60 border border-gray-600/50 text-white hover:bg-gray-600/60 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced EarningsTable Component
const EarningsTable: React.FC<{ earnings: any[]; isLoading: boolean }> = ({
  earnings,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(earnings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEarnings = earnings.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (d: string) => {
    const date = new Date(d);
    if (window.innerWidth < 768) {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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
        className="relative mb-6 sm:mb-8 group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div
          className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
          }}
        >
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-amber-200/80 text-lg mb-2">No earnings recorded yet</p>
            <p className="text-amber-200/50 text-sm">Your earnings will appear here once you start earning</p>
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
      className="relative mb-8 group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
      <div
        className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Earnings History
          </h3>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              name: "Total Earnings",
              amount: earnings.reduce((sum, e) => sum + (e.amountUSD || 0), 0),
              type: "total"
            },
            {
              name: "Total Transactions",
              amount: earnings.length,
              type: "count"
            },
            {
              name: "Average per Transaction",
              amount: earnings.length > 0 ? earnings.reduce((sum, e) => sum + (e.amountUSD || 0), 0) / earnings.length : 0,
              type: "average"
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="relative group/card"
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover/card:opacity-40 transition-opacity" />
              <div
                className="relative p-5 rounded-2xl border-2 border-orange-500/30 shadow-lg overflow-hidden backdrop-blur-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="px-3 py-1 bg-orange-600/30 border border-orange-500/40 rounded-lg backdrop-blur-sm">
                      <div className="text-orange-300 font-bold text-sm">{card.name}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                    {card.type === "count" ? card.amount : formatAmount(card.amount)}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                    </svg>
                    <div className="text-amber-300 font-semibold text-sm">
                      {card.type === "count" ? "Transactions" : "USD Value"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table Container */}
        <div className="relative group/table">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 group-hover/table:opacity-30 transition-opacity" />
          <div
            className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl overflow-hidden backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-amber-500/5">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Slot
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      From User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-200 uppercase tracking-wider">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            e.type?.toLowerCase().includes('direct') ? 'bg-green-400' :
                            e.type?.toLowerCase().includes('level') ? 'bg-blue-400' :
                            e.type?.toLowerCase().includes('bonus') ? 'bg-purple-400' : 'bg-orange-400'
                          }`} />
                          <span className="text-white text-sm font-medium group-hover:text-amber-100 transition-colors">
                            {e.type}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-bold text-base">
                            {formatAmount(e.amountUSD)}
                          </span>
                          <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-60" />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                          <svg className="w-3 h-3 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          <span className="text-amber-100 font-semibold text-sm">
                            Slot {e.slot?.slotNumber || e.slotNumber}
                          </span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {e.sourcePosition?.userId ? (
                            <>
                              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                              <span className="text-amber-200 text-sm font-medium">
                                User #{e.sourcePosition.userId}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-sm">System</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-amber-200/70 text-sm font-medium">
                          {formatDate(e.createdAt)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-6 group/pagination"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-20 group-hover/pagination:opacity-30 transition-opacity" />
            <div
              className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border-2 border-orange-500/30 backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
              }}
            >
              {/* Page Info */}
              <div className="text-sm text-amber-200/70 text-center sm:text-left">
                Showing <span className="font-semibold text-amber-200">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-amber-200">
                  {Math.min(startIndex + itemsPerPage, earnings.length)}
                </span>{' '}
                of <span className="font-semibold text-amber-200">{earnings.length}</span> results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 text-orange-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-orange-200 text-sm group-hover:text-amber-100 transition-colors">
                    Previous
                  </span>
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 font-semibold text-sm ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg shadow-orange-500/25'
                            : 'border-orange-500/30 text-amber-200/70 hover:bg-orange-500/10 hover:text-amber-100'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-orange-200 text-sm group-hover:text-amber-100 transition-colors">
                    Next
                  </span>
                  <svg className="w-4 h-4 text-orange-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
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
  const [lastUsersPerSlot, setLastUsersPerSlot] = useState<{[key: string]: number[]}>({});

  // Mouse move effect for 3D cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePosition({ 
        x: (e.clientX - cx) / cx, 
        y: (e.clientY - cy) / cy 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Derived flags
  const myUserId = localStorage.getItem("userId");
  const viewUserId = localStorage.getItem("viewUserId");
  const isViewMode = !!viewUserId && viewUserId !== myUserId;

  useEffect(() => {
    const viewUserId = localStorage.getItem("viewUserId");
    const storedUserId = localStorage.getItem("userId");
    const targetUserId = viewUserId || storedUserId;
    if (targetUserId) {
      setUserId(targetUserId);
      loadEarningsData(targetUserId);
    }
  }, []);

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

  const fetchMatrixPositions = async () => {
    try {
      const viewUserId = localStorage.getItem("viewUserId");
      const storedUserId = localStorage.getItem("userId");
      const targetUserId = viewUserId || storedUserId;
      if (!targetUserId) return;

      const matrixData = await dashboardApiService.getMatrixPositions(parseInt(targetUserId));
      setMatrixPositions(matrixData.positions || []);
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

  const handleSlotActivation = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    setActivatingSlot(selectedSlot.id);

    if (isViewMode) {
      toast.info("You are viewing another user's account. Slot activation is disabled in view-only mode.");
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
      await fetchMatrixPositions();
    } catch (error: any) {
      toast.error(error.message || "Failed to activate slot");
      setActivatingSlot(null);
    } finally {
      setIsBooking(false);
    }
  };

  const transformSlotsToLevels = (slotsData: any[]) => {
    return slotsData.map((slot) => {
      const userSlot = dashboardData?.slots?.find(
        (s: any) => s.slotNumber === slot.slotNumber
      );

      const isActive = !!userSlot;
      const previousSlotActive =
        slot.slotNumber === 1 ||
        dashboardData?.slots?.some(
          (s: any) =>
            s.slotNumber === slot.slotNumber - 1 && s.isActive === true
        );

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
        ethCost: (slot.priceUSD / 1894).toFixed(4),
        filled: isActive ? Math.min(3, actualChildrenCount) : 0,
        state,
        isActive,
        lastUsers: lastUsersPerSlot[slot.slotNumber] || []
      };
    });
  };

  const levels = transformSlotsToLevels(slots);

  const getVisibleLevels = () => {
    let batchesToShow = 1;
    
    for (let batch = 1; batch <= Math.ceil(levels.length / 5); batch++) {
      const batchStart = (batch - 1) * 5 + 1;
      const batchEnd = batch * 5;
      const batchLevels = levels.filter(lvl => lvl.id >= batchStart && lvl.id <= batchEnd);
      
      const isBatchCompleted = batchLevels.every(lvl => lvl.state === "ACTIVE");
      
      if (isBatchCompleted) {
        batchesToShow = batch + 1;
      } else {
        break;
      }
    }
    
    const maxVisible = batchesToShow * 5;
    return levels.slice(0, Math.min(maxVisible, levels.length));
  };

  const visibleLevels = getVisibleLevels();

  const userStats = dashboardData
    ? {
        id: dashboardData.user?.userId?.toString() || userId,
        totalEarnings: dashboardData.stats?.totalEarned || 0,
        totalETH: (dashboardData.stats?.totalEarned / 1894).toFixed(3) || 0,
        totalDividend: dashboardData.stats.dividendTotal,
        currentETHPrice: 1894,
        levels:
          dashboardData.slots?.map((slot: any, index: number) => ({
            level: index + 1,
            eth: slot.priceUSD / 1894,
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
        totalETH: 0,
        totalDividend: 0,
        currentETHPrice: 1894,
        levels: [],
      };

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
        <Header userStats={userStats} walletAddress={walletAddress} />

        {/* View-only indicator */}
        {isViewMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center justify-between bg-amber-900/10 border-2 border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl">
              <div className="text-amber-200 text-sm">
                Viewing user ID <span className="font-semibold">#{userId}</span> (view-only)
              </div>
              <motion.button
                onClick={() => {
                  localStorage.removeItem('viewUserId');
                  const myId = localStorage.getItem('userId');
                  if (myId) {
                    setUserId(myId);
                    loadDashboardData(myId);
                    loadEarningsData(myId);
                    fetchMatrixPositions();
                    navigate('/dashboard');
                  } else {
                    navigate('/');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-semibold hover:from-amber-400 hover:to-orange-400 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to My Account
              </motion.button>
            </div>
          </motion.div>
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

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-3xl border-2 border-orange-500/30 backdrop-blur-xl"
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

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div
              className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-orange-300/70 text-sm font-medium">Total Earnings</div>
                </div>
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  ${userStats.totalEarnings.toLocaleString()}
                </motion.div>
                <div className="flex items-center gap-2">
                  <div className="text-amber-400 text-lg font-semibold">
                    {userStats.totalETH} ETH
                  </div>
                  <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold">
                    +12.5%
                  </div>
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
              transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div
              className="relative rounded-3xl p-6 border-2 border-yellow-500/30 shadow-2xl backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8m6 0a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                  </div>
                  <div className="text-yellow-300/70 text-sm font-medium">Dividend Earned</div>
                </div>
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  ${userStats.totalDividend?.toFixed(2)}
                </motion.div>
                <div className="text-yellow-300 text-sm font-semibold">
                  Lifetime Dividend Income
                </div>
              </div>
            </div>
          </motion.div>

          {/* ETH Price Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div
              className="relative rounded-3xl p-6 border-2 border-amber-500/30 shadow-2xl backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                    </svg>
                  </div>
                  <div className="text-amber-300/70 text-sm font-medium">Ethereum Price</div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                  ${userStats.currentETHPrice}
                </div>
                <div className="text-amber-300 text-sm">
                  1 ETH = ${userStats.currentETHPrice} USD
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative group mb-8"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 2}deg)`,
          }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
          <div
            className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="text-orange-300/70 text-sm font-medium">Referral Link</div>
              </div>
              <div
                className="rounded-xl p-3 border-2 border-orange-500/30 mb-4 shadow-inner backdrop-blur-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))"
                }}
              >
                <div className="text-sm text-orange-200 break-all font-mono">
                  {window.location.origin}/ref/{userId}
                </div>
              </div>
              <motion.button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/ref/${userId}`);
                  toast.success("Referral link copied to clipboard!");
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg relative overflow-hidden border-2 border-orange-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy Referral Link
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Platform Levels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
          <div
            className="relative rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
            }}
          >
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-center text-white mb-6 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-3xl font-bold tracking-wide bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent text-center sm:text-left"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                MATRIX <span className="text-pink-400">X3</span>
              </motion.div>
              
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
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {visibleLevels.map((lvl, index) => (
                    <motion.div
                      key={lvl.id}
                      className="relative backdrop-blur-xl border-2 border-orange-500/30 shadow-2xl rounded-2xl 
                         p-4 text-white transition-all duration-300 hover:border-amber-400 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{
                        transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 2}deg)`,
                      }}
                      onClick={() => {
                        if (lvl.state === "LOCKED") return;
                        if (lvl.state === "ACTIVE") navigate(`/matrix/${lvl.id}/${userId}`);
                        if (lvl.state === "READY") {
                          if (isViewMode) {
                            toast.info("You are viewing a user in view-only mode. You cannot activate slots.");
                            return;
                          }
                          setSelectedSlot(lvl);
                          setShowSlotModal(true);
                        }
                      }}
                    >
                      {/* Last Users Indicator */}
                      {lvl.lastUsers.length > 0 && (
                        <div className="absolute -top-2 -right-2 z-30">
                          <LastUsersIndicator 
                            lastThreeUserIds={lvl.lastUsers} 
                          />
                        </div>
                      )}

                      {/* READY OVERLAY */}
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
                                    font-bold text-center rounded-xl py-2 text-base overflow-hidden border-2 border-orange-500/50 shadow-lg cursor-pointer 
                                    transition-all duration-200 hover:scale-105 hover:shadow-xl 
                                    ${lvl.state === "ACTIVE" ? "ring-2 ring-green-400" : ""}`}
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
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-white"
                        >
                          {lvl.id}
                        </span>

                        <span className="text-white">
                          {activatingSlot === lvl.id ? "Activating..." : lvl.cost}
                        </span>
                      </div>

                      {/* User Circles */}
                      <div
                        className="flex justify-center gap-3 mt-6 mb-3 relative z-10"
                      >
                        {[0, 1, 2].map((position) => {
                          const userId = lvl.lastUsers[position];
                          const hasUser = !!userId;

                          return (
                            <div
                              key={position}
                              className={`
                                w-8 h-8 rounded-full border-2 border-amber-400/70 relative
                                before:content-[''] before:absolute
                                before:bottom-full before:left-1/2 before:-translate-x-1/2
                                before:w-[2px] before:h-6
                                before:border-l-2 before:border-dashed before:border-amber-400/50
                                ${hasUser ? "bg-amber-400" : "bg-transparent"}
                                transition-all duration-300 ease-in-out
                                flex items-center justify-center
                              `}
                              title={hasUser ? `User #${userId}` : `Position ${position + 1} - Empty`}
                            >
                              {hasUser && (
                                <span className="text-black font-bold text-xs">
                                  #{userId}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* ETH text */}
                      <div className="text-xs text-center mt-2 text-amber-200">
                        ETH: {lvl.ethCost}
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
                        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl"
                      />
                    </motion.div>
                  ))}
                </div>

                {visibleLevels.length >= levels.length && levels.length > 0 && (
                  <motion.div
                    className="text-center mt-4 text-green-400 font-semibold bg-green-500/30 border-2 border-green-500/40 py-3 rounded-2xl text-sm backdrop-blur-sm"
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
        </motion.div>

        {/* Earnings Table */}
        <div className="mt-8">
          <EarningsTable earnings={earnings} isLoading={earningsLoading} />
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

export default Dashboard;