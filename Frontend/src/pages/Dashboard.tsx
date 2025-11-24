import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import Header from "./Header";
import axios from "axios";
import { FaLock, FaShoppingCart } from "react-icons/fa";

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

// MatrixIcons Component
const MatrixIcons: React.FC = () => {
    const icons = [
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            x: "15%",
            y: "15%",
            color: "text-orange-400"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            x: "50%",
            y: "15%",
            color: "text-amber-400"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
            ),
            x: "85%",
            y: "15%",
            color: "text-yellow-400"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            x: "15%",
            y: "50%",
            color: "text-orange-300"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            ),
            x: "50%",
            y: "50%",
            color: "text-amber-300"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
            ),
            x: "85%",
            y: "50%",
            color: "text-yellow-300"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
            ),
            x: "15%",
            y: "85%",
            color: "text-orange-500"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                </svg>
            ),
            x: "50%",
            y: "85%",
            color: "text-amber-500"
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
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
                    className={`absolute opacity-20 ${item.color}`}
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

// Simple LastUsersIndicator component - Only shows the latest UserID
const LastUsersIndicator: React.FC<{ 
  lastThreeUserIds: number[];
}> = ({ lastThreeUserIds }) => {
  // Don't render anything if there are no users
  if (lastThreeUserIds.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Simple circle showing the latest UserID */}
      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-orange-400 shadow-lg">
        <div className="text-white font-bold text-xs">
          #{lastThreeUserIds[0]}
        </div>
      </div>
    </div>
  );
};

const BuySlotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  slotData: any;
  onActivate: () => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, slotData, onActivate, isLoading }) => {
  if (!isOpen || !slotData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-gray-900 p-6 rounded-2xl border border-orange-400/40 shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-4">
          Activate Slot {slotData.id}
        </h2>

        {/* Box */}
        <div className="bg-gray-800 p-4 rounded-xl border border-orange-400/30 mb-4">
          <p className="text-amber-200">
            <strong>Slot Number:</strong> #{slotData.id}
          </p>
          <p className="text-amber-200">
            <strong>Cost:</strong> ${slotData.priceUSD} USD
          </p>
          <p className="text-amber-200">
            <strong>ETH:</strong> {slotData.ethCost} ETH
          </p>
        </div>

        {/* Info */}
        <div className="bg-gray-700 p-3 rounded-xl text-amber-100 text-sm mb-4">
          💡 After activation, click the slot card again to view your matrix
          structure.
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-600 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onActivate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold"
          >
            {isLoading ? "Activating..." : "Activate Slot"}
          </button>
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
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(earnings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEarnings = earnings.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (d: string) => {
    const date = new Date(d);
    
    // Mobile: Short format, Desktop: Long format
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
          className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
          }}
        >
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-amber-200/80 text-base sm:text-lg mb-2">No earnings recorded yet</p>
            <p className="text-amber-200/50 text-xs sm:text-sm">Your earnings will appear here once you start earning</p>
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
      className="relative mb-6 sm:mb-8 group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
      <div
        className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Earnings History
          </h3>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
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
                className="relative p-3 sm:p-5 rounded-2xl border border-orange-500/30 shadow-lg overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
                }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="px-2 py-1 sm:px-3 sm:py-1 bg-orange-600/30 border border-orange-500/40 rounded-lg backdrop-blur-sm">
                      <div className="text-orange-300 font-bold text-xs sm:text-sm">{card.name}</div>
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                    {card.type === "count" ? card.amount : formatAmount(card.amount)}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                    </svg>
                    <div className="text-amber-300 font-semibold text-sm sm:text-base">
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
            className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-amber-500/5">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      Slot
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-amber-200 uppercase tracking-wider">
                      From User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-amber-200 uppercase tracking-wider">
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
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            e.type?.toLowerCase().includes('direct') ? 'bg-green-400' :
                            e.type?.toLowerCase().includes('level') ? 'bg-blue-400' :
                            e.type?.toLowerCase().includes('bonus') ? 'bg-purple-400' : 'bg-orange-400'
                          }`} />
                          <span className="text-white text-xs sm:text-sm font-medium group-hover:text-amber-100 transition-colors truncate max-w-[80px] sm:max-w-none">
                            {e.type}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-bold text-sm sm:text-base md:text-lg">
                            {formatAmount(e.amountUSD)}
                          </span>
                          <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-60" />
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className="inline-flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                          <svg className="w-3 h-3 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          <span className="text-amber-100 font-semibold text-xs sm:text-sm">
                            Slot {e.slot?.slotNumber || e.slotNumber}
                          </span>
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          {e.sourcePosition?.userId ? (
                            <>
                              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                              <span className="text-amber-200 text-xs sm:text-sm font-medium truncate max-w-[60px] sm:max-w-none">
                                User #{e.sourcePosition.userId}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-xs sm:text-sm">System</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-amber-200/70 text-xs sm:text-sm font-medium">
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
              className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-orange-500/30"
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
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                >
                  <svg className="w-4 h-4 text-orange-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-orange-200 text-sm group-hover:text-amber-100 transition-colors">
                    Previous
                  </span>
                </button>

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
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl border transition-all duration-200 font-semibold text-sm ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg shadow-orange-500/25'
                            : 'border-orange-500/30 text-amber-200/70 hover:bg-orange-500/10 hover:text-amber-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/30 bg-gradient-to-r from-gray-700 to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-500/20 hover:to-amber-500/10 transition-all duration-200 group"
                >
                  <span className="text-orange-200 text-sm group-hover:text-amber-100 transition-colors">
                    Next
                  </span>
                  <svg className="w-4 h-4 text-orange-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
  const [lastUsersPerSlot, setLastUsersPerSlot] = useState<{[key: string]: number[]}>({});

  // Mouse move effect for 3D cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      loadEarningsData(storedUserId);
    }
  }, []);

  // Fetch matrix positions for the current user
  const fetchMatrixPositions = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        console.error("No userId found in localStorage");
        return;
      }

      const matrixData = await dashboardApiService.getMatrixPositions(parseInt(storedUserId));
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
    const storedUserId = localStorage.getItem("userId");

    if (!sessionToken || !isConnected) {
      navigate("/");
      return;
    }

    if (storedWallet) setWalletAddress(storedWallet);
    if (storedUserId) {
      setUserId(storedUserId);
      loadDashboardData(storedUserId);
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
        ethCost: (slot.priceUSD / 1894).toFixed(4),
        filled: isActive ? Math.min(3, actualChildrenCount) : 0,
        state,
        isActive,
        // Add last users for this specific slot from the matrix data
        lastUsers: lastUsersPerSlot[slot.slotNumber] || []
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
      const batchLevels = levels.filter(lvl => lvl.id >= batchStart && lvl.id <= batchEnd);
      
      // Check if ALL levels in this batch are ACTIVE (not just READY or not LOCKED)
      const isBatchCompleted = batchLevels.every(lvl => lvl.state === "ACTIVE");
      
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
        totalETH: (dashboardData.stats?.totalEarned / 1894).toFixed(3) || 0,
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
        currentETHPrice: 1894,
        levels: [],
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white font-sans overflow-hidden relative">
      {/* SnowFall and MatrixIcons Components */}
      <SnowFall />
      <MatrixIcons />

      <Header userStats={userStats} walletAddress={walletAddress} />

      <BuySlotModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        slotData={selectedSlot}
        onActivate={handleSlotActivation}
        isLoading={isBooking}
      />

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            }}
          >
            <div
              className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-orange-300/70 text-xs sm:text-sm font-medium">Total Earnings</div>
                </div>
                <motion.div
                  className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  ${userStats.totalEarnings.toLocaleString()}
                </motion.div>
                <div className="flex items-center gap-2">
                  <div className="text-amber-400 text-lg sm:text-xl font-semibold">
                    {userStats.totalETH} ETH
                  </div>
                  <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold">
                    +12.5%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ETH Price Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            }}
          >
            <div
              className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                    </svg>
                  </div>
                  <div className="text-orange-300/70 text-xs sm:text-sm font-medium">Ethereum Price</div>
                </div>
                <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                  ${userStats.currentETHPrice}
                </div>
                <div className="text-amber-300 text-xs sm:text-sm">
                  1 ETH = ${userStats.currentETHPrice} USD
                </div>
              </div>
            </div>
          </motion.div>

          {/* Affiliate Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            }}
          >
            <div
              className="relative rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))"
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div className="text-orange-300/70 text-xs sm:text-sm font-medium">Referral Link</div>
                </div>
                <div
                  className="rounded-xl p-2 sm:p-3 border border-orange-500/30 mb-2 sm:mb-3 shadow-inner"
                  style={{
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))"
                  }}
                >
                  <div className="text-xs text-orange-200 break-all font-mono">
                    {window.location.origin}/ref/{userId}
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/ref/${userId}`);
                    toast.success("Referral link copied to clipboard!");
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-2 sm:py-3 rounded-xl transition-all shadow-lg relative overflow-hidden border border-orange-500/30 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Copy Referral Link
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform Levels */}
        <div
          className="relative z-10 w-full bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-orange-500/30"
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
                      if (lvl.state === "ACTIVE") navigate(`/matrix/${lvl.id}`);
                      if (lvl.state === "READY") {
                        setSelectedSlot(lvl);
                        setShowSlotModal(true);
                      }
                    }}
                  >
                    {/* Last Users Indicator - Positioned at top right (only shows if there are users) */}
                    {lvl.lastUsers.length > 0 && (
                      <div className="absolute -top-1 -right-2 z-30">
                        <LastUsersIndicator 
                          lastThreeUserIds={lvl.lastUsers} 
                        />
                      </div>
                    )}

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
                            title={hasUser ? `User #${userId}` : `Position ${position + 1} - Empty`}
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