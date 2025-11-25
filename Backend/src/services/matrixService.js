import User from "../models/User.js";
import Slot from "../models/Slot.js";
import UserSlot from "../models/UserSlot.js";
import MatrixPosition from "../models/MatrixPosition.js";
import Earning from "../models/Earning.js";
import DividendPoolRecord from "../models/DividendPoolRecord.js";
import ReentryEvent from "../models/ReentryEvent.js";

const ROI_MULTIPLIER = Number(process.env.ROI_MULTIPLIER || 3);
const L1_P = Number(process.env.LEVEL1_PERCENT || 0.2);
const L2_P = Number(process.env.LEVEL2_PERCENT || 0.1);
const L3_P = Number(process.env.LEVEL3_PERCENT || 0.05);
const DIV_P = Number(process.env.DIVIDEND_PERCENT || 0.31);
const RE_P = Number(process.env.REENTRY_PERCENT || 0.34);
const MAX_CHILDREN = 3;
const MAX_LEVELS = 3;
const FULL_MATRIX_TOTAL = 39;

/* ------------------------------ userId counter ----------------------------- */
export async function getNextUserId() {
    const lastUser = await User.findOne().sort({ userId: -1 }).lean();
    return lastUser ? lastUser.userId + 1 : 1;
}

/* ------------------------------- registerUser ------------------------------ */
export async function registerUser(walletAddress, sponsorUserId) {
    let user = await User.findOne({ walletAddress });
    if (user) return user;

    let sponsor = null;
    if (sponsorUserId) {
        sponsor = await User.findOne({ userId: sponsorUserId });
    }

    const nextUserId = await getNextUserId();

    user = await User.create({
        userId: nextUserId,
        walletAddress,
        sponsorUser: sponsor ? sponsor._id : null,
        sponsorUserId: sponsor ? sponsor.userId : null,
    });

    if (sponsor) {
        sponsor.directReferrals.push(user._id);
        await sponsor.save();
    }

    return user;
}

/* ------------------------------ sponsor chain ------------------------------ */
export async function getSponsorChain(user) {
    const chain = [];
    let current = null;

    if (user.sponsorUser) {
        current = await User.findById(user.sponsorUser);
    }

    while (current) {
        chain.push(current);
        if (!current.sponsorUser) break;
        current = await User.findById(current.sponsorUser);
    }

    return chain;
}

/* ------------------------- find entry root for slot ------------------------ */
export async function findEntryRootForSlot(user, slot) {
    // 1) Try sponsor chain first
    const sponsorChain = await getSponsorChain(user);

    for (const sponsor of sponsorChain) {
        const sponsorPos = await MatrixPosition.findOne({
            user: sponsor._id,
            slot: slot._id,
        }).sort({ createdAt: -1 });

        if (sponsorPos) {
            // Proper sponsor/upline found → good
            return sponsorPos;
        }
    }

    // 2) If sponsor unavailable → place under GLOBAL ROOT OF SLOT
    const anyRootOfSlot = await MatrixPosition.findOne({
        slot: slot._id,
        parentPosition: null,
    }).sort({ createdAt: 1 });

    if (anyRootOfSlot) {
        // 👇 NEW RULE:
        // "From root where user have space there it will be positioned"
        return anyRootOfSlot;
    }

    // 3) If truly no one exists in the slot → user becomes root
    return null; // user will become the very FIRST root of the slot
}

/* -------------------------- BFS placement (parent) ------------------------- */
export async function findPlacementParentBFS(entryRoot) {
    const queue = [entryRoot];

    while (queue.length > 0) {
        const current = queue.shift();

        if ((current.children || []).length < MAX_CHILDREN) {
            return current;
        }

        const children = await MatrixPosition.find({
            _id: { $in: current.children },
        }).sort({ createdAt: 1 });

        queue.push(...children);
    }

    return null;
}

/* -------------------------- create matrix position ------------------------- */
export async function createMatrixPosition(
    user,
    slot,
    { isReentry = false, cycleIndex = 1 } = {}
) {
    const entryRoot = await findEntryRootForSlot(user, slot);
    let parentPosition = null;
    let depth = 0;

    if (entryRoot) {
        const candidateParent = await findPlacementParentBFS(entryRoot);
        if (!candidateParent) {
            throw new Error("No available parent found in matrix tree for placement");
        }
        parentPosition = candidateParent;
        depth = (parentPosition.depth || 0) + 1;
    }

    const position = await MatrixPosition.create({
        user: user._id,
        userId: user.userId,
        slot: slot._id,
        slotNumber: slot.slotNumber,
        parentPosition: parentPosition ? parentPosition._id : null,
        children: [],
        depth,
        sponsorUser: user.sponsorUser || null,
        sponsorUserId: user.sponsorUserId || null,
        isReentry,
        cycleIndex,
        matrixCounts: { level1: 0, level2: 0, level3: 0, total: 0 },
        matrixCompleted: false,
        status: "ACTIVE",
    });

    // THE FIX 👇
     if (parentPosition) {

        parentPosition.children.push(position._id);

        await parentPosition.save();

    }

    await updateMatrixCountsAndCheckCompletion(position);

    return position;
}



/* ------------- update counts (3 levels up) & trigger re-entry ------------- */
export async function updateMatrixCountsAndCheckCompletion(newPosition) {
    let current = newPosition.parentPosition
        ? await MatrixPosition.findById(newPosition.parentPosition)
        : null;
    let distance = 1;
    const completedPositions = [];
    // :fire: FIX — update ALL ancestors (no MAX_LEVELS limit)
    while (current) {
        // Level-based depth updates remain same
        if (distance === 1) current.matrixCounts.level1 += 1;
        if (distance === 2) current.matrixCounts.level2 += 1;
        if (distance === 3) current.matrixCounts.level3 += 1;
        // Always increment total
        current.matrixCounts.total += 1;
        const matirxCount = current.matrixCounts.level1 + current.matrixCounts.level2 + current.matrixCounts.level3;
        // :fire: Trigger completion when 39 downline filled
        if (!current.matrixCompleted && matirxCount >= FULL_MATRIX_TOTAL) {
            current.matrixCompleted = true;
            current.status = "COMPLETED";
            completedPositions.push(current);
        }
        await current.save();
        if (!current.parentPosition) break;
        current = await MatrixPosition.findById(current.parentPosition);
        distance++;
    }
    // :fire: Create re-entry & ReentryEvent correctly
    for (const pos of completedPositions) {
        await triggerReentryForPosition(pos, newPosition);
    }
}








/* ------------------------------ trigger reentry ---------------------------- */
export async function triggerReentryForPosition(completedPosition, triggeredByPosition) {
    const user = await User.findById(completedPosition.user);
    const slot = await Slot.findById(completedPosition.slot);
    if (!user || !slot) return;

    // Find highest existing cycleIndex for this user in this slot
    const lastPos = await MatrixPosition.findOne({
        user: user._id,
        slot: slot._id,
    })
        .sort({ cycleIndex: -1 })
        .lean();

    const cycleIndexBefore = completedPosition.cycleIndex;
    const cycleIndexAfter = lastPos ? lastPos.cycleIndex + 1 : cycleIndexBefore + 1;

    const newPosition = await createMatrixPosition(user, slot, {
        isReentry: true,
        cycleIndex: cycleIndexAfter,
    });

    await ReentryEvent.create({
        user: user._id,
        userId: user.userId,
        slot: slot._id,
        slotNumber: slot.slotNumber,
        completedPosition: completedPosition._id,
        newPosition: newPosition._id,
        cycleIndexBefore,
        cycleIndexAfter,
        triggeredByPosition: triggeredByPosition._id,
    });

}


/* ------------------------ distribute slot payment logic -------------------- */
export async function distributeSlotPayment(position, slot, { isReentry = false } = {}) {
    const price = slot.priceUSD;

    const level1Amount = price * L1_P;
    const level2Amount = price * L2_P;
    const level3Amount = price * L3_P;
    const dividendAmount = price * DIV_P;
    const reentryReserveAmount = price * RE_P; // stays in contract on-chain

    const upline1 = position.parentPosition
        ? await MatrixPosition.findById(position.parentPosition)
        : null;
    const upline2 =
        upline1 && upline1.parentPosition
            ? await MatrixPosition.findById(upline1.parentPosition)
            : null;
    const upline3 =
        upline2 && upline2.parentPosition
            ? await MatrixPosition.findById(upline2.parentPosition)
            : null;

    if (upline1) {
        await creditLevelIncome(upline1, level1Amount, position, "LEVEL1");
    }
    if (upline2) {
        await creditLevelIncome(upline2, level2Amount, position, "LEVEL2");
    }
    if (upline3) {
        await creditLevelIncome(upline3, level3Amount, position, "LEVEL3");
    }

    if (!isReentry) {
        await recordDividendContribution(dividendAmount, position, slot);
    }

    // reentryReserveAmount -> just logged or handled by smart contract
}

/* --------------------------- credit level incomes -------------------------- */
export async function creditLevelIncome(uplinePosition, amount, fromPosition, type) {
    const receiverUser = await User.findById(uplinePosition.user);
    const slot = await Slot.findById(uplinePosition.slot);
    if (!receiverUser || !slot) return;

    let userSlot = await UserSlot.findOne({
        user: receiverUser._id,
        slot: slot._id,
    });

    if (!userSlot) {
        userSlot = await UserSlot.create({
            user: receiverUser._id,
            userId: receiverUser.userId,
            slot: slot._id,
            slotNumber: slot.slotNumber,
            totalInvested: 0,
            totalEarned: 0,
            roiCap: 0,
            isActive: false,
        });
    }

    userSlot.totalEarned += amount;
    await userSlot.save();

    await Earning.create({
        user: receiverUser._id,
        userId: receiverUser.userId,
        slot: slot._id,
        slotNumber: slot.slotNumber,
        amountUSD: amount,
        type,
        sourcePosition: fromPosition._id,
        uplinePosition: uplinePosition._id,
    });
}

/* -------------------------- record dividend (IN) --------------------------- */
export async function recordDividendContribution(amount, position, slot) {
    const user = await User.findById(position.user);
    if (!user) return;

    await DividendPoolRecord.create({
        recordType: "IN",
        amountUSD: amount,
        fromUser: user._id,
        fromUserId: user.userId,
        slotNumber: slot.slotNumber,
    });
}

/* -------------------------- activate slot (fresh) -------------------------- */
export async function activateSlot(user, slotNumber) {
    const slot = await Slot.findOne({ slotNumber });
    if (!slot) throw new Error("Slot not found");

    if (slotNumber > 1) {
        const prevSlot = await Slot.findOne({ slotNumber: slotNumber - 1 });
        const prevUserSlot = await UserSlot.findOne({
            user: user._id,
            slot: prevSlot._id,
            isActive: true,
        });
        if (!prevUserSlot) {
            throw new Error(`You must activate slot ${slotNumber - 1} first`);
        }
    }

    let userSlot = await UserSlot.findOne({ user: user._id, slot: slot._id });

    if (!userSlot) {
        userSlot = await UserSlot.create({
            user: user._id,
            userId: user.userId,
            slot: slot._id,
            slotNumber: slot.slotNumber,
            totalInvested: 0,
            totalEarned: 0,
            roiCap: 0,
            isActive: false,
        });
    }

    userSlot.totalInvested += slot.priceUSD;
    userSlot.roiCap = userSlot.totalInvested * ROI_MULTIPLIER;
    userSlot.isActive = true;
    await userSlot.save();

    const position = await createMatrixPosition(user, slot, {
        isReentry: false,
        cycleIndex: 1,
    });

    await distributeSlotPayment(position, slot, { isReentry: false });

    return position;
}

export async function getUserDashboard(userId) {
  const user = await User.findOne({ userId }).lean();
  if (!user) throw new Error("User not found");

  // Get user slots with their activity status
  const userSlots = await UserSlot.find({ userId })
    .populate("slot", "slotNumber priceUSD")
    .lean();

  // Calculate total earnings
  const earnings = await Earning.aggregate([
    { $match: { userId } },
    { $group: { _id: null, totalEarned: { $sum: "$amountUSD" } } }
  ]);

  const totalEarned = earnings.length > 0 ? earnings[0].totalEarned : 0;

  // Calculate total invested
  const totalInvested = userSlots.reduce((sum, userSlot) => {
    return sum + (userSlot.totalInvested || 0);
  }, 0);

  // Get matrix positions count
  const positionsCount = await MatrixPosition.countDocuments({ userId });

  return {
    user: {
      userId: user.userId,
      walletAddress: user.walletAddress,
      sponsorUserId: user.sponsorUserId
    },
    stats: {
      totalEarned,
      totalInvested,
      positionsCount,
      activeSlots: userSlots.filter(slot => slot.isActive).length
    },
    slots: userSlots.map(slot => ({
      slotNumber: slot.slotNumber,
      priceUSD: slot.slot.priceUSD,
      isActive: slot.isActive,
      totalInvested: slot.totalInvested,
      totalEarned: slot.totalEarned,
      roiCap: slot.roiCap
    })),
    earnings: await Earning.find({ userId })
      .populate("slot", "slotNumber")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  };
}

/* ---------------------------- Get User Earnings --------------------------- */
export async function getUserEarnings(userId, limit = 50) {
  return await Earning.find({ userId })
    .populate("slot", "slotNumber")
    .populate("sourcePosition", "userId")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

/* ---------------------------- Get Slot Details --------------------------- */
export async function getSlotDetails(slotNumber) {
  const slot = await Slot.findOne({ slotNumber }).lean();
  if (!slot) throw new Error("Slot not found");

  const activeUsers = await UserSlot.countDocuments({ 
    slotNumber, 
    isActive: true 
  });

  const totalInvested = await UserSlot.aggregate([
    { $match: { slotNumber, isActive: true } },
    { $group: { _id: null, total: { $sum: "$totalInvested" } } }
  ]);

  return {
    ...slot,
    activeUsers,
    totalInvested: totalInvested.length > 0 ? totalInvested[0].total : 0
  };
}

