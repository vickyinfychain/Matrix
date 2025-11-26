import { motion } from "framer-motion";
import { useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react"; // or any other icon library

interface HeaderProps {
  userStats: { id: string };
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
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="relative z-10 border-b border-orange-500/30 bg-gray-800/80 backdrop-blur-xl shadow-lg">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* FLEX WRAPPER – Fully Responsive */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* LEFT SECTION */}
          <motion.div
            className="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-[220px]
             justify-center sm:justify-start" // ← ADD THIS
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo + Title */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-[130px]">
              <motion.div
                className="relative w-8 h-8 sm:w-12 sm:h-12"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg" />
                <div className="absolute inset-1 bg-gray-900 rounded-lg" />
                <div className="absolute inset-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-md" />
              </motion.div>

              <div>
                <span className="text-base xs:text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  MATRIX 3x3
                </span>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-orange-300/70 font-medium">
                  Web3 Platform
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            className="flex items-center gap-2 sm:gap-4 flex-shrink-0 
             justify-center w-full sm:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Wallet Box */}
            <div className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700/60 border border-orange-500/30 rounded-xl backdrop-blur-sm shadow-lg text-center sm:text-left text-xs xs:text-sm">
              <div className="text-[9px] xs:text-[10px] sm:text-xs text-orange-300/70 mb-1">
                Wallet
              </div>
              <div className="text-xs xs:text-sm font-bold text-white flex items-center gap-1 xs:gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {formatWalletAddress(walletAddress)}
              </div>
            </div>

            {/* USER ID BOX */}
            <div className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700/60 border border-orange-500/30 rounded-xl backdrop-blur-sm flex-shrink text-xs xs:text-sm">
              <span className="text-[9px] xs:text-[10px] sm:text-xs text-orange-300/70">
                User ID 
              </span> &nbsp;
               <span className="text-xs xs:text-sm sm:text-base font-bold text-orange-200">
                 {userStats.id}
              </span>
            </div>

            {/* 🔄 REFRESH BUTTON WITH ICON ONLY */}
            <motion.button
              onClick={() => window.location.reload()}
              className="p-2 sm:p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/50 rounded-xl text-blue-300 transition-all shadow-lg backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title="Refresh Page"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Disconnect Button */}
            <motion.button
              onClick={handleLogout}
              className="px-2 py-1 sm:px-5 sm:py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-xl text-red-400 font-semibold text-[10px] xs:text-xs sm:text-sm transition-all shadow-lg backdrop-blur-sm whitespace-nowrap"
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
