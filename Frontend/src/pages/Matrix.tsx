import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCaretUp,
  FaCaretDown,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "./Header";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  matrixCounts?: {
    level1: number;
    level2: number;
    level3: number;
    total: number;
  };
  cycleIndex?: number;
}

// Axios API functions for Matrix
const matrixApiService = {
  // Get user tree data
  getUserTree: async (slotNumber: number, userId: number, cycleIndex: number = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tree/${slotNumber}/${userId}/${cycleIndex}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch tree data"
      );
    }
  },

  // Get dashboard data (for header)
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

  // Get available cycles
  getAvailableCycles: async (userId: string, slotNumber: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/user/${userId}/slot/${slotNumber}/cycles`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch available cycles"
      );
    }
  },
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

export default function MatrixPage() {
  const [selectedPosition, setSelectedPosition] = useState<MatrixPosition | null>(null);
  const [refreshCount, setRefreshCount] = useState(1);
  const [navigationStack, setNavigationStack] = useState<MatrixPosition[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlot, setCurrentSlot] = useState(1);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [availableCycles, setAvailableCycles] = useState<number[]>([1]);
  const [cyclesInitialized, setCyclesInitialized] = useState(false);

  const navigate = useNavigate();
  const { slotNumber, userId: paramUserId } = useParams();

  const viewUserId = paramUserId || localStorage.getItem('viewUserId');
  const isViewMode = !!localStorage.getItem('viewUserId') && (String(paramUserId || '') !== String(localStorage.getItem('userId')));

  useEffect(() => {
    const init = async () => {
      // Prefer userId from route param (e.g. /matrix/:slotNumber/:userId) if provided
      // Next prefer view-only userId (if viewing someone), finally fallback to local storage userId
      const storedUserId = paramUserId || localStorage.getItem("viewUserId") || localStorage.getItem("userId");
      const storedWallet = localStorage.getItem("walletAddress");

      if (!storedUserId) {
        navigate("/");
        return;
      }

      setUserId(storedUserId);
      setWalletAddress(storedWallet || "");

      const slot = slotNumber ? parseInt(slotNumber) : 1;
      setCurrentSlot(slot);

      // Make sure we treat this as a fresh load for cycles
      setCyclesInitialized(false);

      try {
        // This will fetch cycles, set latest cycle, AND call loadTreeData(...) for latest.
        await checkAvailableCycles(storedUserId, slot);
      } catch (err) {
        // fallback: if cycles check fails, load tree with current refreshCount
        await loadTreeData(storedUserId, slot, refreshCount);
      }

      // dashboard can load independently
      loadDashboardData(storedUserId);
    };

    init();
    // run again when slotNumber changes or navigate changes
  }, [navigate, slotNumber]);

  function findUserPosition(node: MatrixPosition, userId: number): MatrixPosition | null {
    if (node.userId === userId) return node;

    if (!node.children) return null;

    for (const child of node.children) {
      const found = findUserPosition(child, userId);
      if (found) return found;
    }

    return null;
  }

  const loadTreeData = async (userId: string, slotNumber: number, cycleIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      setTreeData(null);
      setSelectedPosition(null); 
      setNavigationStack([]);

      const data = await matrixApiService.getUserTree(
        slotNumber,
        Number(userId),
        cycleIndex
      );

      const cleanedData = cleanTreeData(data);
      setTreeData(cleanedData);

      // FIXED: Always show latest cycle first and find user's position
      const numericUserId = Number(userId);
      let viewerNode: MatrixPosition | null = null;
      
      // Find the user's position in the current cycle
      viewerNode = findUserPosition(cleanedData.root, numericUserId);
      
      // If user position not found in current cycle, check if we should show latest available cycle
      if (!viewerNode && cycleIndex === 1) {
        // Try to find the latest cycle where user exists
        const availableCyclesResponse = await matrixApiService.getAvailableCycles(userId, slotNumber);
        const availableCycles = availableCyclesResponse.availableCycles || [1];
        
        if (availableCycles.length > 0) {
          const latestCycle = Math.max(...availableCycles);
          if (latestCycle > 1) {
            // Auto-navigate to latest cycle
            setRefreshCount(latestCycle);
            await loadTreeData(userId, slotNumber, latestCycle);
            return;
          }
        }
      }

      // Set initial selected position
      if (viewerNode) {
        setSelectedPosition(viewerNode);
        
        // Find and set parent in navigation stack
        const viewerParent = findParentNode(cleanedData.root, viewerNode);
        if (viewerParent) {
          setNavigationStack([viewerParent]);
        }
      } else {
        // User is viewing root or their position isn't in this cycle
        setSelectedPosition(null);
        setNavigationStack([]);
      }

    } catch (error: any) {
      console.error("Failed to load tree data:", error);
      setError(
        error.response?.data?.error ||
        error.message ||
        "Failed to load matrix data"
      );
      setTreeData(null);
      toast.error("Failed to load matrix data");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailableCycles = async (userId: string, slotNumber: number) => {
    try {
      const response = await matrixApiService.getAvailableCycles(userId, slotNumber);

      const cycles: number[] = Array.isArray(response.availableCycles)
        ? response.availableCycles.map((c: any) => Number(c))
        : [1];

      const sortedCycles: number[] = cycles.sort((a: number, b: number) => b - a);

      setAvailableCycles(sortedCycles);

      // Auto-select latest ONLY FIRST TIME
      if (!cyclesInitialized && sortedCycles.length > 0) {
        const latest = sortedCycles[0];
        setRefreshCount(latest);     // set latest cycle
        setCyclesInitialized(true);

        // IMPORTANT: Load tree for latest cycle
        await loadTreeData(userId, slotNumber, latest);
        return;
      }
    } catch (error) {
      console.warn("Failed to fetch available cycles");
      setAvailableCycles([1]);
    }
  };

  const isCycleAvailable = (cycleIndex: number) => {
    return availableCycles.includes(cycleIndex);
  };

  const cleanTreeData = (data: any): TreeData => {
    if (!data || !data.root) {
      throw new Error("Invalid tree data structure");
    }

    const cleanNode = (node: any): MatrixPosition => {
      return {
        ...node,
        children:
          Array.isArray(node.children) && node.children.length > 0
            ? node.children.map(cleanNode)
            : undefined,
      };
    };

    return {
      ...data,
      root: cleanNode(data.root),
    };
  };

  const loadDashboardData = async (userId: string) => {
    try {
      const data = await matrixApiService.getDashboard(userId);
      setDashboardData(data);
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const handlePositionClick = (position: MatrixPosition) => {
    console.log("Clicked position:", position);

    const hasValidChildren =
        position.children &&
        Array.isArray(position.children) &&
        position.children.length > 0 &&
        position.children.some((child) => child.userId && child.positionId);

    if (!hasValidChildren) {
        toast.info("This is the last level. No children available.");
        return;
    }

    // FIXED: Better navigation stack management
    setNavigationStack((prev) => {
        // Only add to stack if we're not already at this position
        if (!selectedPosition || selectedPosition.positionId !== position.positionId) {
            return [...prev, currentNode!];
        }
        return prev;
    });
    setSelectedPosition(position);
  };

  const handleBackClick = () => {
    if (navigationStack.length > 0) {
      const previousPosition = navigationStack[navigationStack.length - 1];
      setSelectedPosition(previousPosition);
      setNavigationStack((prev) => prev.slice(0, -1));
    } else {
      setSelectedPosition(null);
    }
  };

  const handleMainIdClick = () => {
    if (selectedPosition) {
      handleBackClick();
    }
  };

  // FIXED: Handle cycle index change for re-entry
  const handleCycleIndexChange = (newCycleIndex: number) => {
    if (newCycleIndex >= 1 && isCycleAvailable(newCycleIndex)) {
      setRefreshCount(newCycleIndex);
      loadTreeData(userId, currentSlot, newCycleIndex);
    } else {
      toast.info(`Cycle ${newCycleIndex} is not available`);
    }
  };

  // Get matrix counts from tree data
  const matrixCounts = treeData?.matrixCounts || {
    level1: 0,
    level2: 0,
    level3: 0,
    total: 0
  };

  const currentNode: MatrixPosition | null =
    selectedPosition || (treeData ? treeData.root : null);

  const currentPositions = currentNode?.children || [];

  // FIXED: Enhanced findParentNode function to handle edge cases
  function findParentNode(root: MatrixPosition, child: MatrixPosition): MatrixPosition | null {
    if (!root.children || root.children.length === 0) return null;

    // Check direct children first
    for (const directChild of root.children) {
      if (directChild.positionId === child.positionId) {
        return root;
      }
    }

    // Recursively check grandchildren
    for (const directChild of root.children) {
      if (directChild.children && directChild.children.length > 0) {
        const found = findParentNode(directChild, child);
        if (found) return found;
      }
    }

    return null;
  }

  // FIXED: Current data calculation
  const getParentId = () => {
    // 1) If backend returned realParent (best & correct)
    if (treeData && (treeData as any).realParent && (treeData as any).realParent.userId) {
      return (treeData as any).realParent.userId;
    }

    // 2) If a node is selected, try to find its parent inside full tree
    if (selectedPosition && treeData?.root) {
      const parent = findParentNode(treeData.root, selectedPosition);
      if (parent) return parent.userId;
    }

    // 3) If viewing root level
    return 0;
  };

  const getMainId = () => {
    // Always return the actual user's ID from localStorage when at root level
    if (!selectedPosition) {
      return Number(userId) || treeData?.root?.userId || 0;
    }
    
    // When a position is selected, show that position's userId
    return selectedPosition.userId;
  };

  // FIXED: Current data calculation
  const currentData = {
    parentId: getParentId(),
    mainId: getMainId(),
    stats: {
      users: currentNode?.children?.length || 0,
      gift: currentNode?.children?.filter(pos => pos.isReentry).length || 0,
      refresh: refreshCount
    }
  };

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
        totalEarnings: 42527,
        totalETH: 22.455,
        currentETHPrice: 1894,
        levels: [
          { level: 1, eth: 0.025, tip: 178, percentage: 59 },
          { level: 2, eth: 0.05, tip: 44, percentage: 15 },
          { level: 3, eth: 0.1, tip: 13, percentage: 4 },
        ],
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
            <h3 className="text-red-400 text-xl font-bold mb-2">
              Error Loading Matrix
            </h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
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

      {/* View-only indicator */}
      {isViewMode && (
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 relative z-10">
          <div className="flex items-center justify-between bg-amber-900/10 border border-amber-500/20 rounded-xl p-3">
            <div className="text-amber-200 text-sm">
              Viewing user ID <span className="font-semibold">#{viewUserId}</span> (view-only)
            </div>
            <div>
              <button
                onClick={() => {
                  localStorage.removeItem('viewUserId');
                  const myId = localStorage.getItem('userId');
                  if (myId) {
                    navigate(`/matrix/${currentSlot}/${myId}`);
                  } else {
                    navigate('/dashboard');
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

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 
      text-white font-sans overflow-hidden px-4 sm:px-6 
      flex flex-col items-center gap-16 relative pt-12 pb-20">

        {/* SnowFall and MatrixIcons Components */}
        <SnowFall />
        <MatrixIcons />

        {/* Back Button */}
        <div className="
          absolute 
          top-3 left-3 
          sm:top-5 sm:left-5 
          md:top-6 md:left-6 
          z-30
        ">
          <button
            onClick={() => navigate("/dashboard")}
            className="
              flex items-center gap-1 sm:gap-2
              bg-amber-500 hover:bg-amber-600 
              text-gray-900 font-semibold

              /* Responsive padding */
              px-3 py-1.5 
              sm:px-4 sm:py-2 
              md:px-5 md:py-2.5

              /* Responsive font size */
              text-xs sm:text-sm md:text-base

              rounded-lg
              transition-all duration-200 
              hover:scale-105 shadow-lg 
              border border-amber-300
            "
          >
            <FaArrowLeft className="text-xs sm:text-sm md:text-base" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Main Container */}
        <div className="relative top-4 w-full max-w-4xl h-[700px] bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-orange-500/30 overflow-hidden">
          {/* Header - MATRIX X3 with arrows */}
          
          <div className="absolute top-6 left-6 text-white text-xl font-bold tracking-wide">
            MATRIX <span className="text-amber-400">X3</span>
            <span className="text-gray-400 text-sm ml-1">
              Slot {currentSlot}
            </span>
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
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-amber-400/60 text-xl">
              ↑
            </span>
          </div>

          {/* Cycle Navigation - Left Side */}
          <div className="absolute top-1/2 left-[calc(50%-160px)] -translate-y-1/2 flex items-center text-amber-200 text-lg z-20">
            <div className="flex flex-col items-center mx-1">
              <button
                className={`transition-colors mb-1 hover:scale-110 transform duration-200 w-6 h-6 flex items-center justify-center ${
                  isCycleAvailable(refreshCount + 1) 
                    ? "text-amber-300 hover:text-orange-400 cursor-pointer" 
                    : "text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => handleCycleIndexChange(refreshCount + 1)}
                disabled={!isCycleAvailable(refreshCount + 1)}
                title={isCycleAvailable(refreshCount + 1) ? `Go to cycle ${refreshCount + 1}` : `Cycle ${refreshCount + 1} not available`}
              >
                <FaCaretUp />
              </button>
              
              <span className="text-amber-200 font-bold my-2 text-xl">
                Cycle {refreshCount}
              </span>
              
              <button
                className={`transition-colors mt-1 hover:scale-110 transform duration-200 w-6 h-6 flex items-center justify-center ${
                  isCycleAvailable(Math.max(1, refreshCount - 1)) 
                    ? "text-amber-300 hover:text-orange-400 cursor-pointer" 
                    : "text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => handleCycleIndexChange(Math.max(1, refreshCount - 1))}
                disabled={!isCycleAvailable(Math.max(1, refreshCount - 1)) || refreshCount <= 1}
                title={isCycleAvailable(refreshCount - 1) ? `Go to cycle ${refreshCount - 1}` : `Cycle ${refreshCount - 1} not available`}
              >
                <FaCaretDown />
              </button>
            </div>
          </div>

          {/* Main ID Box */}
          <div
            className="absolute top-52 left-1/2 -translate-x-1/2 w-[280px] bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-center rounded-xl py-3 text-2xl shadow-lg cursor-pointer z-20"
            onClick={handleMainIdClick}
          >
            {currentData.mainId > 0
              ? `ID ${currentData.mainId}`
              : "MATRIX ROOT"}
          </div>

          {/* Dashed Lines Container */}
          <div className="absolute inset-x-0 top-[440px] flex justify-center h-[137px] pointer-events-none z-0">
            {/* Left Line */}
            <div
              className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute origin-top-left"
              style={{
                transform:
                  "translateX(-105px) rotate(20deg) translateY(-150px)",
              }}
            ></div>
            {/* Center Line */}
            <div
              className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute"
              style={{
                transform:
                  "translateX(115px) rotate(-17deg) translateY(-150px)",
              }}
            ></div>
            {/* Right Line */}
            <div
              className="w-[2px] h-full border-l-2 border-dashed border-amber-400/60 absolute origin-top-right"
              style={{
                transform: "translateX(0px) rotate(0deg) translateY(-150px)",
              }}
            ></div>
          </div>

          {/* Bottom Positions */}
          {currentPositions && currentPositions.length > 0 ? (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex justify-center gap-8 z-20">
              {currentPositions.map((position, index) => (
                <motion.div
                  key={position.positionId || `pos-${index}`}
                  className="text-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePositionClick(position)}
                >
                  <div
                    className={`w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center mx-auto mb-2 relative
                      ${
                        position.relation === "SELF"
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : position.relation === "DIRECT_PARTNER"
                          ? "bg-gradient-to-br from-green-500 to-emerald-500"
                          : position.relation === "UPLINE_OVERFLOW"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : position.relation === "BOTTOM_OVERFLOW"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-gray-500 to-slate-500"
                      }
                      ${
                        selectedPosition?.positionId === position.positionId
                          ? "ring-4 ring-amber-300 ring-opacity-50"
                          : ""
                      }`}
                  >
                    {/* Show indicator if position has children */}
                    {position.children && position.children.length > 0 && (
                      <div className="group absolute -bottom-1 -right-1">
                        {/* Original dot (unchanged) */}
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-amber-500"></div>
                        {/* Tooltip */}
                        <div
                          className="absolute bottom-6 right-0 w-36 p-2 bg-black/80 text-amber-200
                 rounded-md text-xs shadow-lg border border-amber-500/30
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                 pointer-events-none"
                        >
                          <div className="font-bold text-green-400 mb-1">
                            Children
                          </div>
                          Total: {position.children.length}
                        </div>
                      </div>
                    )}
                    {/* Re-entry cycle indicator */}
                    {position.isReentry && (
                      <div className="group absolute -top-1 -left-1">
                        {/* Original dot */}
                        <div className="w-3 h-3 bg-red-500 rounded-full border border-amber-500"></div>
                        {/* Tooltip */}
                        <div
                          className="absolute top-6 left-0 w-32 p-2 bg-black/80 text-amber-200
                 rounded-md text-xs shadow-lg border border-amber-500/30
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                 pointer-events-none"
                        >
                          <div className="font-bold text-red-400 mb-1">
                            Re-entry
                          </div>
                          Status: {position.isReentry ? "Active" : "No"}
                        </div>
                      </div>
                    )}
                    {/* Cycle number badge */}
                    <div className="group absolute -top-2 -right-2">
                      {/* Original badge (unchanged) */}
                      <div
                        className="bg-amber-600 text-white text-xs rounded-full w-5 h-5
                  flex items-center justify-center border border-amber-300 cursor-pointer"
                      >
                        {position.cycleIndex}
                      </div>
                      {/* Tooltip */}
                      <div
                        className="absolute top-7 right-0 w-40 p-2 bg-black/80 text-amber-200
               rounded-md text-xs shadow-lg border border-amber-500/30
               opacity-0 group-hover:opacity-100 transition-opacity duration-200
               pointer-events-none"
                      >
                        <div className="font-bold text-amber-300 mb-1">
                          Cycle Details
                        </div>
                        Cycle: {position.cycleIndex} <br />
                        Children: {position.children?.length || 0} <br />
                        Re-entry: {position.isReentry ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  <div className="text-amber-200 text-sm font-semibold">
                    ID {position.userId || "N/A"}
                  </div>

                  <div className="flex items-center justify-center text-amber-200 text-xs opacity-90">
                    <span className="text-amber-400 text-sm mr-1">
                      <FaUsers />
                    </span>
                    {position.children ? position.children.length : 0}
                  </div>

                  <div className="text-xs text-gray-400 mt-1 capitalize">
                    {position.relation ? position.relation.replace("_", " ").toLowerCase() : "unknown"}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-20">
              <div className="bg-gray-800/80 border border-amber-500/30 rounded-xl px-6 py-4">
                <p className="text-amber-200 text-lg font-semibold">No Positions Available</p>
                <p className="text-amber-200/70 text-sm mt-1">
                  {!selectedPosition 
                    ? 'No matrix positions found for this slot' 
                    : 'No children available at this level'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Info */}
          <div className="
            absolute bottom-4 left-1/2 -translate-x-1/2 
            text-center 
            text-amber-200/80 
            text-[10px] sm:text-xs md:text-sm
            leading-relaxed 
            px-2 sm:px-4 
            w-[90%] sm:w-auto
          ">
            {selectedPosition ? (
              <p className="break-words">
                Viewing children of ID {selectedPosition.userId}. Click circles to navigate deeper.
              </p>
            ) : (
              <p className="break-words">
                Click on circles to explore the matrix structure
              </p>
            )}

            <p className="text-[9px] sm:text-xs text-amber-400/70 mt-1 break-words">
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
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="text-orange-200">
                    Loading slot {currentSlot}...
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* details data */}
        <div className="w-full max-w-6xl px-4 mt-16 mb-6 relative group">
          {/* Main Background with Grid and Effects */}
          <div className="relative bg-gray-900/80 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Background Grid for entire container */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(251, 191, 36, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(251, 191, 36, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/10"></div>
            </div>

            {/* Floating Particles for entire container */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* All your existing content goes here - now with relative z-10 */}
            <div className="relative z-10">
              {/* Matrix Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level 1 */}
                <div className="relative group">
                  {/* Gold Glow Effect - Removed blur */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-2xl opacity-20 group-hover:opacity-30 transition duration-500 animate-pulse"></div>

                  <div className="relative bg-gray-800/80 backdrop-blur-xl border border-amber-400/40 rounded-xl p-6 shadow-lg hover:shadow-amber-400/30 hover:scale-105 transition-all duration-300">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 rounded-xl opacity-5 bg-gradient-to-br from-amber-200 via-transparent to-yellow-200"></div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-xl"></div>

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-amber-300 font-bold text-xl tracking-wider">LEVEL 01</h3>
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/20">
                          <span className="text-gray-900 font-bold text-sm">1</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse shadow-md shadow-green-500/30"></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-amber-100">
                        <span className="text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">MATRIX FILL</span>
                        <span className="font-mono font-bold text-amber-300">{matrixCounts.level1}/3</span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="relative">
                        <div className="w-full h-8 bg-gray-700/80 rounded-full overflow-hidden relative border border-amber-400/30 shadow-sm">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full relative flex items-center justify-end pr-3"
                            initial={{ width: 0 }}
                            animate={{ width: `${(matrixCounts.level1 / 3) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                            <span className="text-gray-900 font-bold text-xs z-10 relative">
                              {Math.round((matrixCounts.level1 / 3) * 100)}%
                            </span>
                          </motion.div>
                          <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                            <span className="text-amber-200/80 font-bold text-xs">
                              {Math.round((matrixCounts.level1 / 3) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${matrixCounts.level1 >= 3 ? 'text-green-400' : 'text-red-400'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${matrixCounts.level1 >= 3 ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                          <span className="text-sm font-semibold">
                            {matrixCounts.level1 >= 3 ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        {matrixCounts.level1 >= 3 && (
                          <div className="text-green-400 animate-bounce">
                            <FaCheckCircle className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="relative group">
                  {/* Gold Glow Effect - Removed blur */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-2xl opacity-20 group-hover:opacity-30 transition duration-500 animate-pulse"></div>

                  <div className="relative bg-gray-800/80 backdrop-blur-xl border border-amber-400/40 rounded-xl p-6 shadow-lg hover:shadow-amber-400/30 hover:scale-105 transition-all duration-300">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 rounded-xl opacity-5 bg-gradient-to-br from-amber-200 via-transparent to-yellow-200"></div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-xl"></div>

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-amber-300 font-bold text-xl tracking-wider">LEVEL 02</h3>
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/20">
                          <span className="text-gray-900 font-bold text-sm">2</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse shadow-md shadow-green-500/30"></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-amber-100">
                        <span className="text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">NETWORK EXPANSION</span>
                        <span className="font-mono font-bold text-amber-300">{matrixCounts.level2}/9</span>
                      </div>

                      <div className="relative">
                        <div className="w-full h-8 bg-gray-700/80 rounded-full overflow-hidden relative border border-amber-400/30 shadow-sm">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full relative flex items-center justify-end pr-3"
                            initial={{ width: 0 }}
                            animate={{ width: `${(matrixCounts.level2 / 9) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                            <span className="text-gray-900 font-bold text-xs z-10 relative">
                              {Math.round((matrixCounts.level2 / 9) * 100)}%
                            </span>
                          </motion.div>
                          <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                            <span className="text-amber-200/80 font-bold text-xs">
                              {Math.round((matrixCounts.level2 / 9) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${matrixCounts.level2 >= 9 ? 'text-green-400' : 'text-red-400'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${matrixCounts.level2 >= 9 ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                          <span className="text-sm font-semibold">
                            {matrixCounts.level2 >= 9 ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        {matrixCounts.level2 >= 9 && (
                          <div className="text-green-400 animate-bounce">
                            <FaCheckCircle className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="relative group">
                  {/* Gold Glow Effect - Removed blur */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-2xl opacity-20 group-hover:opacity-30 transition duration-500 animate-pulse"></div>

                  <div className="relative bg-gray-800/80 backdrop-blur-xl border border-amber-400/40 rounded-xl p-6 shadow-lg hover:shadow-amber-400/30 hover:scale-105 transition-all duration-300">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 rounded-xl opacity-5 bg-gradient-to-br from-amber-200 via-transparent to-yellow-200"></div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-xl"></div>

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-amber-300 font-bold text-xl tracking-wider">LEVEL 03</h3>
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/20">
                          <span className="text-gray-900 font-bold text-sm">3</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse shadow-md shadow-green-500/30"></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-amber-100">
                        <span className="text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">FULL MATRIX</span>
                        <span className="font-mono font-bold text-amber-300">{matrixCounts.level3}/27</span>
                      </div>

                      <div className="relative">
                        <div className="w-full h-8 bg-gray-700/80 rounded-full overflow-hidden relative border border-amber-400/30 shadow-sm">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full relative flex items-center justify-end pr-3"
                            initial={{ width: 0 }}
                            animate={{ width: `${(matrixCounts.level3 / 27) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                            <span className="text-gray-900 font-bold text-xs z-10 relative">
                              {Math.round((matrixCounts.level3 / 27) * 100)}%
                            </span>
                          </motion.div>
                          <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                            <span className="text-amber-200/80 font-bold text-xs">
                              {Math.round((matrixCounts.level3 / 27) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${matrixCounts.level3 >= 27 ? 'text-green-400' : 'text-red-400'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${matrixCounts.level3 >= 27 ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                          <span className="text-sm font-semibold">
                            {matrixCounts.level3 >= 27 ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        {matrixCounts.level3 >= 27 && (
                          <div className="text-green-400 animate-bounce">
                            <FaCheckCircle className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Matrix Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: matrixCounts.total, label: "TOTAL NODES" },
                  { value: matrixCounts.level1, label: "LEVEL 1 ACTIVE" },
                  { value: matrixCounts.level2, label: "LEVEL 2 ACTIVE" },
                  { value: matrixCounts.level3, label: "LEVEL 3 ACTIVE" }
                ].map((stat, index) => (
                  <div key={index} className="relative group">
                    {/* Gold Glow Effect - Removed blur */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>

                    <div className="relative bg-gray-800/70 backdrop-blur-lg border border-amber-400/30 rounded-lg p-4 text-center group hover:border-amber-400/50 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-amber-400/20">
                      <div className="text-amber-300 text-2xl font-bold font-mono group-hover:text-yellow-300 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-amber-200 text-sm mt-1 group-hover:text-amber-100 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
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
            className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
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
        </div>
      </div>
    </>
  );
}