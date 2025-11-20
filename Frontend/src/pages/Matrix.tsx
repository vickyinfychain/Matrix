import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaGift,
    FaCaretUp,
    FaCaretDown,
    FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Header from "./Header";
import { apiService } from "../services/api";

// Define the structure for a matrix position
interface MatrixPosition {
    positionId: string;
    userId: number;
    walletAddress: string;
    depth: number;
    cycleIndex: number;
    isReentry: boolean;
    relation: string;
    children?: MatrixPosition[];
    slotNumber?: number;
}

// Define the structure for tree data
interface TreeData {
    slotNumber: number;
    userId: number;
    root: MatrixPosition;
}

// Snow Fall Background Component
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

// Floating Icons for 3x3 Matrix with Web3/Crypto Icons
const MatrixIcons: React.FC = () => {
    const icons = [
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            x: "15%",
            y: "15%",
            color: "text-orange-400"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            x: "50%",
            y: "15%",
            color: "text-amber-400"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
            ),
            x: "85%",
            y: "15%",
            color: "text-yellow-400"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            ),
            x: "50%",
            y: "50%",
            color: "text-amber-300"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
            ),
            x: "85%",
            y: "50%",
            color: "text-yellow-300"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
            ),
            x: "15%",
            y: "85%",
            color: "text-orange-500"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                </svg>
            ),
            x: "50%",
            y: "85%",
            color: "text-amber-500"
        },
        {
            icon: (
                <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
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

export default function MatrixPage() {
    const [hovered, setHovered] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<MatrixPosition | null>(null);
    const [refreshCount, setRefreshCount] = useState(122);
    const [navigationStack, setNavigationStack] = useState<MatrixPosition[]>([]);
    const [walletAddress, setWalletAddress] = useState("");
    const [userId, setUserId] = useState("");
    const [treeData, setTreeData] = useState<TreeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSlot, setCurrentSlot] = useState(1);

    const navigate = useNavigate();
    const { slotNumber } = useParams();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedWallet = localStorage.getItem("walletAddress");
        
        if (storedUserId) {
            setUserId(storedUserId);
            setWalletAddress(storedWallet || "");
            
            // Use slot number from URL or default to 1
            const slot = slotNumber ? parseInt(slotNumber) : 1;
            setCurrentSlot(slot);
            loadTreeData(storedUserId, slot);
        } else {
            navigate('/');
        }
    }, [navigate, slotNumber]);

    const loadTreeData = async (userId: string, slotNumber: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getUserTree(slotNumber, Number(userId));
            setTreeData(data);
        } catch (error: any) {
            console.error("Failed to load tree data:", error);
            setError(error.message || "Failed to load matrix data");
            toast.error("Failed to load matrix data");
        } finally {
            setLoading(false);
        }
    };

    const handlePositionClick = (position: MatrixPosition) => {
        if (position.children && position.children.length > 0) {
            setNavigationStack(prev => [...prev, selectedPosition!]);
            setSelectedPosition(position);
            
            // Calculate stats based on children
            const userCount = position.children.length;
            const giftCount = position.children.filter(child => child.isReentry).length;
            setRefreshCount(giftCount);
        } else {
            toast.info("No children positions available for this node");
        }
    };

    const handleBackClick = () => {
        if (navigationStack.length > 0) {
            const previousPosition = navigationStack[navigationStack.length - 1];
            setSelectedPosition(previousPosition);
            setNavigationStack(prev => prev.slice(0, -1));
            
            // Recalculate stats
            if (previousPosition?.children) {
                const giftCount = previousPosition.children.filter(child => child.isReentry).length;
                setRefreshCount(giftCount);
            }
        } else {
            setSelectedPosition(null);
            setRefreshCount(treeData?.root.children ? 
                treeData.root.children.filter(child => child.isReentry).length : 122
            );
        }
    };

    const handleMainIdClick = () => {
        if (selectedPosition) {
            handleBackClick();
        }
    };

    // Get current positions to display
    const currentPositions = selectedPosition ? 
        (selectedPosition.children || []) : 
        (treeData?.root.children || []);

    // Calculate current data for display
    const currentData = {
        parentId: selectedPosition ? 
            (selectedPosition.relation === "SELF" ? 0 : selectedPosition.userId) : 
            (treeData?.root.userId || 0),
        mainId: selectedPosition ? selectedPosition.userId : (treeData?.root.userId || 0),
        earnings: {
            dollars: 0, // You can calculate this from backend earnings data
            eth: 0
        },
        stats: {
            users: currentPositions.length,
            gift: currentPositions.filter(pos => pos.isReentry).length,
            refresh: refreshCount
        }
    };

    // Mock user stats for header
    const userStats = {
        id: userId || "487498",
        totalEarnings: 42527,
        totalETH: 22.455,
        currentETHPrice: 1894,
        levels: [
            { level: 1, eth: 0.025, tip: 178, percentage: 59 },
            { level: 2, eth: 0.05, tip: 44, percentage: 15 },
            { level: 3, eth: 0.1, tip: 13, percentage: 4 },
        ]
    };

    // Slot navigation
    const handleSlotChange = (newSlot: number) => {
        if (newSlot >= 1 && newSlot <= 10) { // Assuming max 10 slots
            setCurrentSlot(newSlot);
            loadTreeData(userId, newSlot);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-orange-200 text-lg">Loading matrix data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 max-w-md">
                        <h3 className="text-red-400 text-xl font-bold mb-2">Error Loading Matrix</h3>
                        <p className="text-red-300 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header userStats={userStats} walletAddress={walletAddress} />

            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white font-sans overflow-hidden p-4 sm:p-6 flex justify-center items-center relative">
                <SnowFall />
                <MatrixIcons />
                
                {/* Back Button */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
                    <button
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg border border-amber-300"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to Dashboard
                    </button>
                </div>

                {/* Slot Navigation */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
                    <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-xl rounded-xl p-2 border border-orange-500/30">
                        <button
                            onClick={() => handleSlotChange(currentSlot - 1)}
                            disabled={currentSlot <= 1}
                            className="p-2 bg-orange-500/20 hover:bg-orange-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="text-sm" />
                        </button>
                        <span className="px-3 py-1 bg-orange-500/30 rounded-lg font-semibold">
                            Slot {currentSlot}
                        </span>
                        <button
                            onClick={() => handleSlotChange(currentSlot + 1)}
                            disabled={currentSlot >= 10} // Adjust max slots as needed
                            className="p-2 bg-orange-500/20 hover:bg-orange-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="text-sm rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Main Container */}
                <div className="relative top-4 w-full max-w-4xl h-[700px] bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-orange-500/30 overflow-hidden">

                    {/* Header - MATRIX X3 with arrows */}
                    <div className="absolute top-6 left-6 text-white text-xl font-bold tracking-wide">
                        MATRIX <span className="text-amber-400">X3</span>
                        <span className="text-gray-400 text-sm ml-1">Slot {currentSlot}</span>
                    </div>

                    {/* Top ID Box - Parent ID */}
                    <button
                        onClick={handleMainIdClick}
                        className="absolute top-24 left-1/2 -translate-x-1/2 px-6 py-2 border border-amber-500 rounded-lg text-white text-xl font-bold bg-gray-800/90 hover:bg-amber-900/30 transition-colors cursor-pointer"
                    >
                        {currentData.parentId > 0 ? `ID ${currentData.parentId}` : "ROOT"}
                    </button>

                    {/* Upward Arrow connecting Parent ID to Main ID */}
                    <div className="absolute top-40 left-1/2 -translate-x-1/2 w-0 h-12 border-l-2 border-dashed border-amber-400/60">
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-amber-400/60 text-xl">↑</span>
                    </div>

                    {/* Main ID Box - Orange/Amber theme */}
                    <div
                        className="absolute top-52 left-1/2 -translate-x-1/2 w-[280px] bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-center rounded-xl py-3 text-2xl shadow-lg cursor-pointer z-20"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={handleMainIdClick}
                    >
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-900">
                            {selectedPosition ? selectedPosition.cycleIndex : treeData?.root.cycleIndex || 1}
                        </span>
                        {currentData.mainId > 0 ? `ID ${currentData.mainId}` : "MATRIX ROOT"}

                        {/* Tooltip/Popup for position info */}
                        {hovered && currentData.mainId > 0 && (
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-800 text-amber-100 text-sm rounded-md p-3 whitespace-nowrap shadow-xl border border-amber-500 z-30">
                                <div className="font-semibold text-amber-300">Position Info</div>
                                <div className="text-xs text-amber-200 mt-1">
                                    Cycle: {selectedPosition ? selectedPosition.cycleIndex : treeData?.root.cycleIndex}
                                </div>
                                <div className="text-xs text-amber-200">
                                    Re-entry: {selectedPosition ? (selectedPosition.isReentry ? "Yes" : "No") : "No"}
                                </div>
                                <div className="text-xs text-amber-200">
                                    Relation: {selectedPosition ? selectedPosition.relation : "SELF"}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dashed Lines Container */}
                    <div className="absolute inset-x-0 top-[440px] flex justify-center h-[137px] pointer-events-none z-0">
                        {/* Left Line */}
                        <div
                            className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute origin-top-left"
                            style={{ transform: 'translateX(-105px) rotate(20deg) translateY(-150px)' }}
                        ></div>
                        {/* Center Line */}
                        <div
                            className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute"
                            style={{ transform: 'translateX(115px) rotate(-17deg) translateY(-150px)' }}
                        ></div>
                        {/* Right Line */}
                        <div
                            className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute origin-top-right"
                            style={{ transform: 'translateX(0px) rotate(0deg) translateY(-150px)' }}
                        ></div>
                    </div>

                    {/* Left Navigation Arrow */}
                    <button 
                        className="absolute top-1/2 -translate-y-1/2 left-4 bg-gray-800/90 border border-amber-500/50 text-amber-200 text-lg font-bold p-2 rounded-lg flex items-center hover:bg-amber-900/30 transition-colors z-20"
                        onClick={() => handleSlotChange(currentSlot - 1)}
                        disabled={currentSlot <= 1}
                    >
                        <span className="text-amber-300">◄</span>
                    </button>

                    {/* Right Navigation Arrow */}
                    <button 
                        className="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-800/90 border border-amber-500/50 text-amber-200 text-lg font-bold p-2 rounded-lg flex items-center hover:bg-amber-900/30 transition-colors z-20"
                        onClick={() => handleSlotChange(currentSlot + 1)}
                        disabled={currentSlot >= 10}
                    >
                        <span className="text-amber-300">►</span>
                    </button>

                    {/* Left Stats - Refresh Count */}
                    <div className="absolute top-1/2 left-[calc(50%-160px)] -translate-y-1/2 flex items-center text-amber-200 text-lg z-20">
                        <div className="flex flex-col items-center mx-1">
                            <button
                                className="text-amber-300 hover:text-orange-400 transition-colors mb-1 hover:scale-110 transform duration-200 w-6 h-6 flex items-center justify-center"
                                onClick={() => setRefreshCount(prev => prev + 1)}
                            >
                                <FaCaretUp />
                            </button>
                            <span className="text-amber-200 font-bold my-2 text-xl">{refreshCount}</span>
                            <button
                                className="text-amber-300 hover:text-orange-400 transition-colors mt-1 hover:scale-110 transform duration-200 w-6 h-6 flex items-center justify-center"
                                onClick={() => setRefreshCount(prev => Math.max(0, prev - 1))}
                            >
                                <FaCaretDown />
                            </button>
                        </div>
                    </div>

                    {/* Right Stats */}
                    <div className="absolute top-1/2 right-[calc(50%-160px)] -translate-y-1/2 flex items-center z-20">
                        <div className="bg-gray-800/90 border border-amber-500/30 rounded-xl px-3 py-2 shadow-lg">
                            <div className="flex items-center gap-2 text-amber-200 text-lg">
                                <span className="font-semibold">{currentData.stats.users}</span>
                                <FaUsers className="text-amber-400 text-xl" />
                                <span className="font-semibold ml-1">{currentData.stats.gift}</span>
                                <FaGift className="text-orange-400 text-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Positions */}
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex justify-center gap-8 z-20">
                        {currentPositions.map((position, index) => (
                            <motion.div
                                key={position.positionId}
                                className="text-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handlePositionClick(position)}
                            >
                                <div
                                    className={`w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center mx-auto mb-2 relative
                                        ${position.relation === "SELF" ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 
                                          position.relation === "DIRECT_PARTNER" ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                          position.relation === "UPLINE_OVERFLOW" ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                                          position.relation === "BOTTOM_OVERFLOW" ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                                          'bg-gradient-to-br from-gray-500 to-slate-500'}
                                        ${selectedPosition?.positionId === position.positionId ? 'ring-4 ring-amber-300 ring-opacity-50' : ''}`}
                                >
                                    {/* Show indicator if position has children */}
                                    {position.children && position.children.length > 0 && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-amber-500"></div>
                                    )}
                                    
                                    {/* Cycle indicator for re-entries */}
                                    {position.isReentry && (
                                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border border-amber-500"></div>
                                    )}
                                </div>
                                <div className="text-amber-200 text-sm font-semibold">ID {position.userId}</div>
                                <div className="flex items-center justify-center text-amber-200 text-xs opacity-90">
                                    <span className="text-amber-400 text-sm mr-1"><FaUsers /></span> 
                                    {position.children ? position.children.length : 0}
                                </div>
                                <div className="text-xs text-gray-400 mt-1 capitalize">
                                    {position.relation.replace('_', ' ').toLowerCase()}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Info */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-amber-200/70 text-sm">
                        {selectedPosition ? (
                            <p>Viewing children of ID {selectedPosition.userId}. Click circles to navigate deeper.</p>
                        ) : (
                            <p>Click on circles to explore the matrix structure</p>
                        )}
                        <p className="text-xs text-amber-400/60 mt-1">
                            Colors: Self (Orange) • Direct Partner (Green) • Upline (Blue) • Bottom (Purple) • Team (Gray)
                        </p>
                    </div>

                    {/* Loading overlay for slot changes */}
                    {loading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40 rounded-3xl">
                            <motion.div
                                className="bg-gray-800/90 p-4 rounded-xl border border-orange-500/30"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span className="text-orange-200">Loading slot {currentSlot}...</span>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Additional Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
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
                        className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
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
                </div>
            </div>
        </>
    );
}