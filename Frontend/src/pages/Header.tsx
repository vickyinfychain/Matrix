import { motion } from "framer-motion";
import {  useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userStats: {
    id: string;
  };
  walletAddress: string;
}

const Header: React.FC<HeaderProps> = ({ userStats, walletAddress }) => {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  const formatWalletAddress = (address: string) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("sponsorId");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header className="relative z-10 border-b border-orange-500/30 bg-gray-800/80 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <motion.div
            className="flex items-center space-x-3 sm:space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div
                className="relative w-10 h-10 sm:w-12 sm:h-12"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg" />
                <div className="absolute inset-1 bg-gray-900 rounded-lg" />
                <div className="absolute inset-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-md" />
              </motion.div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  MATRIX 3x3
                </span>
                <div className="text-xs text-orange-300/70 font-medium">Web3 Platform</div>
              </div>
            </div>
            <div className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700/60 border border-orange-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-xs text-orange-300/70">User ID</span>
              <span className="text-sm font-bold text-orange-200"> {userStats.id}</span>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 sm:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-700/60 border border-orange-500/30 rounded-xl backdrop-blur-sm shadow-lg">
              <div className="text-xs text-orange-300/70 mb-1">Connected Wallet</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {formatWalletAddress(walletAddress)}
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="px-3 py-2 sm:px-5 sm:py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-xl text-red-400 font-semibold text-sm transition-all shadow-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;