import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import Header from "./Header";
import { apiService } from "../services/api";

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

const BuySlotModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onBookSlot: (slotNumber: string) => void;
    isLoading: boolean;
    availableSlots: any[];
}> = ({ isOpen, onClose, onBookSlot, isLoading, availableSlots }) => {
    const [slotNumber, setSlotNumber] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (slotNumber.trim()) {
            await onBookSlot(slotNumber.trim());
        } else {
            toast.error("Please select a slot");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-md"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur opacity-30" />
                <div className="relative bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            Activate Slot
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 sm:p-2 hover:bg-orange-500/20 rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="text-orange-200 text-sm mb-1 sm:mb-2 block font-medium">
                                Select Slot
                            </label>
                            <select
                                value={slotNumber}
                                onChange={(e) => setSlotNumber(e.target.value)}
                                className="w-full bg-gray-700/60 border border-orange-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
                                required
                            >
                                <option value="">Choose a slot</option>
                                {availableSlots.map((slot) => (
                                    <option key={slot.slotNumber} value={slot.slotNumber}>
                                        Slot {slot.slotNumber} - ${slot.priceUSD} USD
                                    </option>
                                ))}
                            </select>
                        </div>

                        {slotNumber && (
                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                <p className="text-orange-200 text-sm">
                                    Cost: <span className="font-bold">${availableSlots.find(s => s.slotNumber === Number(slotNumber))?.priceUSD} USD</span>
                                </p>
                                <p className="text-orange-300/70 text-xs mt-1">
                                    Activating this slot will place you in the matrix and start earning potential.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/60 hover:bg-gray-600/60 border border-gray-500/30 rounded-xl text-gray-300 font-semibold transition-all text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:from-orange-700 disabled:to-amber-700 text-white font-semibold rounded-xl transition-all relative overflow-hidden group text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-1 sm:gap-2">
                                        <motion.div
                                            className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/50 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1 sm:gap-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Activate Slot
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { isConnected } = useAccount();
    const [walletAddress, setWalletAddress] = useState("");
    const [userId, setUserId] = useState("");
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isBuySlotModalOpen, setIsBuySlotModalOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken");
        const storedWallet = localStorage.getItem("walletAddress");
        const storedUserId = localStorage.getItem("userId");

        if (!sessionToken || !isConnected) {
            navigate("/");
            return;
        }

        if (storedWallet) {
            setWalletAddress(storedWallet);
        }

        if (storedUserId) {
            setUserId(storedUserId);
            loadDashboardData(storedUserId);
        }

        loadSlots();
    }, [navigate, isConnected]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            setMousePosition({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    const loadDashboardData = async (userId: string) => {
        try {
            setLoading(true);
            const data = await apiService.getDashboard(userId);
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
            const slotsData = await apiService.getSlots();
            setSlots(slotsData);
        } catch (error: any) {
            toast.error("Failed to load slots");
        }
    };

    const handleBookSlot = async (slotNumber: string) => {
        setIsBooking(true);
        try {
            const wallet = localStorage.getItem("walletAddress");
            if (!wallet) {
                toast.error("Wallet not found");
                return;
            }

            const result = await apiService.activateSlot(wallet, Number(slotNumber));
            toast.success(`Slot ${slotNumber} activated successfully!`);
            setIsBuySlotModalOpen(false);
            
            // Reload dashboard data
            loadDashboardData(userId);
        } catch (error: any) {
            toast.error(error.message || "Failed to activate slot");
        } finally {
            setIsBooking(false);
        }
    };

    // Get available slots (not yet activated)
    const availableSlots = slots.filter(slot => {
        if (!dashboardData?.slots) return true;
        return !dashboardData.slots.find((userSlot: any) => userSlot.slotNumber === slot.slotNumber && userSlot.isActive);
    });

    // Use actual data from backend or fallback to mock data
    const userStats = dashboardData ? {
        id: dashboardData.user.userId.toString(),
        totalEarnings: dashboardData.stats.totalEarned,
        totalETH: (dashboardData.stats.totalEarned / 1894).toFixed(3),
        currentETHPrice: 1894,
        levels: dashboardData.slots.map((slot: any, index: number) => ({
            level: index + 1,
            eth: slot.priceUSD / 1894,
            tip: slot.totalEarned || 0,
            percentage: Math.min(100, ((slot.totalEarned || 0) / slot.roiCap) * 100),
            isActive: slot.isActive
        }))
    } : {
        id: userId || "487498",
        totalEarnings: 0,
        totalETH: 0,
        currentETHPrice: 1894,
        levels: []
    };

    const earningsData = dashboardData ? [
        { 
            name: "TOTAL EARNINGS", 
            usd: dashboardData.stats.totalEarned, 
            eth: (dashboardData.stats.totalEarned / 1894).toFixed(3) 
        },
        { 
            name: "ACTIVE SLOTS", 
            usd: dashboardData.stats.activeSlots, 
            eth: dashboardData.stats.positionsCount 
        },
        { 
            name: "TOTAL INVESTED", 
            usd: dashboardData.stats.totalInvested, 
            eth: (dashboardData.stats.totalInvested / 1894).toFixed(3),
            percentage: dashboardData.stats.totalEarned > 0 ? 
                Math.min(100, (dashboardData.stats.totalEarned / dashboardData.stats.totalInvested) * 100) : 0
        }
    ] : [
        { name: "TOTAL EARNINGS", usd: 0, eth: 0 },
        { name: "ACTIVE SLOTS", usd: 0, eth: 0 },
        { name: "TOTAL INVESTED", usd: 0, eth: 0, percentage: 0 }
    ];

    const levels = [
        { id: 1, cost: "1", a: 253, b: 122, filled: 2 },
        { id: 2, cost: "2", a: 67, b: 40, filled: 2 },
        { id: 3, cost: "3", a: 36, b: 24, filled: 0 },
        { id: 4, cost: "4", a: 15, b: 13, filled: 2 },
        { id: 5, cost: "5", a: 7, b: 7, filled: 2 },
        { id: 6, cost: "6", a: 4, b: 5, filled: 0 },
        { id: 7, cost: "7", a: 3, b: 2, filled: 1 },
        { id: 8, cost: "8", a: 3, b: 2, filled: 1 },
        { id: 9, cost: "9", a: 3, b: 1, filled: 1 },
        { id: 10, cost: "10", a: 1, b: 0, filled: 1 },
        { id: 11, cost: "11", a: 0, b: 0, filled: 0 },
        { id: 12, cost: "12", a: 0, b: 0, filled: 0 },
        { id: 13, cost: "13", a: 0, b: 0, filled: 0 },
        { id: 14, cost: "14", a: 0, b: 0, filled: 0 },
        { id: 15, cost: "15", a: 0, b: 0, filled: 0 },
    ];

    const [visibleCount, setVisibleCount] = useState(5);
    const loadMore = () => {
        setVisibleCount(prevCount => Math.min(prevCount + 5, levels.length));
    };
    const visibleLevels = levels.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white font-sans overflow-hidden relative">
            <SnowFall />
            <MatrixIcons />
            
            <Header userStats={userStats} walletAddress={walletAddress} />

            <BuySlotModal
                isOpen={isBuySlotModalOpen}
                onClose={() => setIsBuySlotModalOpen(false)}
                onBookSlot={handleBookSlot}
                isLoading={isBooking}
                availableSlots={availableSlots}
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
                    className="absolute bottom-1/4 -right-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20"
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

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 sm:mb-6"
                >
                    <div className="relative group">
                        <div className="relative bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 border border-orange-500/30 shadow-2xl">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                            Quick Slot Activation
                                        </h3>
                                        <p className="text-orange-200/70 text-xs sm:text-sm">
                                            Activate your slot to start earning in the matrix
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => setIsBuySlotModalOpen(true)}
                                    disabled={availableSlots.length === 0}
                                    className={`px-4 sm:px-8 py-3 sm:py-4 ${
                                        availableSlots.length === 0 
                                            ? "bg-gray-600 cursor-not-allowed text-gray-400" 
                                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg hover:shadow-orange-500/40"
                                    } font-bold rounded-xl transition-all relative overflow-hidden group w-full lg:w-auto min-w-[160px] sm:min-w-[200px] text-sm sm:text-base`}
                                    whileHover={availableSlots.length > 0 ? { scale: 1.05 } : {}}
                                    whileTap={availableSlots.length > 0 ? { scale: 0.95 } : {}}
                                >
                                    {availableSlots.length > 0 && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    )}
                                    <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        {availableSlots.length === 0 ? "All Slots Active" : "Activate Slot"}
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
                    {/* Main Stats Cards */}
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

                    {/* Earnings Breakdown */}
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
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    Earnings Breakdown
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                {earningsData.map((earning, index) => (
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
                                                        <div className="text-orange-300 font-bold text-xs sm:text-sm">{earning.name}</div>
                                                    </div>
                                                    {earning.percentage && earning.percentage > 0 && (
                                                        <motion.div
                                                            className="px-2 py-1 bg-green-500/30 border border-green-500/40 rounded-lg text-green-400 text-xs font-bold"
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            +{earning.percentage}%
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                                                    ${earning.usd.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                    </svg>
                                                    <div className="text-amber-300 font-semibold text-sm sm:text-base">{earning.eth} ETH</div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Platform Levels */}
                    <div className="relative z-10 w-full bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-orange-500/30" style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))" }}>
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
                            <motion.button
                                onClick={() => navigate('/matrix')}
                                className="text-lg sm:text-xl cursor-pointer hover:text-orange-400 transition-colors self-end sm:self-auto bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                View Matrix
                            </motion.button>
                        </motion.div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                            {visibleLevels.map((lvl, index) => (
                                <motion.div
                                    key={lvl.id}
                                    className="relative backdrop-blur-xl border border-orange-500/30 shadow-2xl rounded-2xl p-2 sm:p-3 md:p-4 text-white transition-all duration-300 hover:border-amber-400"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{
                                        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))"
                                    }}
                                >
                                    <div 
                                        className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 font-bold text-center rounded-xl py-1 sm:py-2 text-sm sm:text-base md:text-lg overflow-hidden border border-orange-500/50 shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                        onClick={() => navigate('/matrix')}
                                    >
                                        <span className="absolute left-1 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                                            {lvl.id}
                                        </span>
                                        <span className="text-white">{lvl.cost}</span>
                                    </div>
                                    <div className="flex justify-center gap-1 sm:gap-2 md:gap-3 mt-2 sm:mt-4 md:mt-6 mb-2 sm:mb-3 md:mb-4 relative z-10">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-amber-400/70 relative
                                ${lvl.filled > i ? "bg-amber-400" : "bg-transparent"}
                                before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:h-3 sm:before:h-4 md:before:h-6 before:border-l-2 before:border-dashed before:border-amber-400/50`}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center text-xs sm:text-sm mt-1 sm:mt-2">
                                        <div className="flex items-center gap-1 text-amber-300 font-semibold">
                                            {lvl.a} <span className="text-xs sm:text-sm md:text-base">👥</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-green-400 font-semibold">
                                            {lvl.b} <span className="text-xs sm:text-sm md:text-base">🔄</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl" />
                                </motion.div>
                            ))}
                        </div>

                        {visibleCount < levels.length && (
                            <motion.div
                                className="flex justify-center mt-4 sm:mt-6 md:mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <motion.button
                                    onClick={loadMore}
                                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-2xl shadow-lg hover:shadow-orange-500/40 transition-all duration-300 relative overflow-hidden group border border-orange-500/30 text-xs sm:text-sm md:text-base"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <span className="relative z-10">
                                        Load More ({levels.length - visibleCount} remaining)
                                    </span>
                                </motion.button>
                            </motion.div>
                        )}

                        {visibleCount >= levels.length && (
                            <motion.div
                                className="text-center mt-3 sm:mt-4 md:mt-6 text-green-400 font-semibold bg-green-500/30 border border-green-500/40 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm md:text-base backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                All levels loaded! ({levels.length} total)
                            </motion.div>
                        )}

                        <motion.div
                            className="w-full mt-4 sm:mt-6 md:mt-10 border-t border-orange-500/30 pt-3 sm:pt-4 md:pt-6 text-white/80 text-xs sm:text-sm space-y-1 sm:space-y-2 md:space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-amber-400 font-bold text-xs sm:text-sm">eth</span>
                                <span className="text-xs sm:text-sm">— THE COST OF PLATFORMS IN ETH (ETHEREUM)</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-green-400 font-bold text-xs sm:text-sm">🔄</span>
                                <span className="text-xs sm:text-sm">— NUMBER OF REOPENS</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-amber-300 font-bold text-xs sm:text-sm">👥</span>
                                <span className="text-xs sm:text-sm">— PARTNERS ON THE PLATFORM</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                    >
                        <motion.button
                            onClick={() => navigate('/matrix')}
                            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-3 sm:py-4 md:py-5 rounded-2xl transition-all shadow-lg relative overflow-hidden border border-orange-500/30 text-sm sm:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <span className="relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Matrix
                            </span>
                        </motion.button>

                        <motion.button
                            onClick={() => {
                                // Handle withdraw functionality
                                toast.info("Withdraw functionality coming soon!");
                            }}
                            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-3 sm:py-4 md:py-5 rounded-2xl transition-all shadow-lg relative overflow-hidden border border-orange-500/30 text-sm sm:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            <span className="relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Withdraw Earnings
                            </span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-orange-500/30 bg-gray-800/80 backdrop-blur-xl mt-8 sm:mt-12 md:mt-16">
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg" />
                            <div>
                                <div className="font-bold text-orange-200 text-sm sm:text-base">MATRIX 3x3</div>
                                <div className="text-xs text-orange-300/70">Decentralized Web3 Platform</div>
                            </div>
                        </div>
                        <div className="text-center text-orange-300/70 text-xs sm:text-sm">
                            © 2024 MATRIX 3x3. All rights reserved. | Powered by Blockchain Technology
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <motion.a
                                href="#"
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600/20 hover:bg-orange-600/30 rounded-xl flex items-center justify-center transition-colors border border-orange-500/30"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600/20 hover:bg-orange-600/30 rounded-xl flex items-center justify-center transition-colors border border-orange-500/30"
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;