// src/services/treeService.js
import User from "../models/User.js";
import Slot from "../models/Slot.js";
import MatrixPosition from "../models/MatrixPosition.js";

/* ------------ helper: get earliest matrix position for user+slot ---------- */
async function getMainPositionForUserSlot(user, slot,cycleIndex) {
    const pos = await MatrixPosition.findOne({
        user: user._id,
        slot: slot._id,
        cycleIndex
    }).sort({ createdAt: 1 });
    return pos; // can be null if user not placed yet in that slot
}

/* --------------------- helper: get ancestor chain (upwards) --------------- */
async function getAncestorChain(position) {
    const chain = [];
    let current = position;

    while (current && current.parentPosition) {
        const parent = await MatrixPosition.findById(current.parentPosition);
        if (!parent) break;
        chain.push(parent);
        current = parent;
    }

    return chain; // [parent, grandparent, ...]
}

/* ------------- classify node for a given viewer user (tree owner) --------- */
async function classifyNodeForViewer({ viewerUser, viewerRootPos, viewerRootAncestors, nodePosition, slot }) {
    // SELF
    if (String(nodePosition.user) === String(viewerUser._id)) {
        return "SELF";
    }

    // DIRECT PARTNER (sponsored by viewer)
    if (nodePosition.sponsorUserId && nodePosition.sponsorUserId === viewerUser.userId) {
        return "DIRECT_PARTNER";
    }

    // If no sponsor info → generic team member
    if (!nodePosition.sponsorUserId) {
        return "TEAM_MEMBER";
    }

    // find sponsor position in this slot
    const sponsorUser = await User.findOne({ userId: nodePosition.sponsorUserId });
    if (!sponsorUser) return "TEAM_MEMBER";

    const sponsorPos = await MatrixPosition.findOne({
        user: sponsorUser._id,
        slot: slot._id,
    }).sort({ createdAt: 1 });

    if (!sponsorPos) return "TEAM_MEMBER";

    const viewerRootAndAncestorsIds = [
        viewerRootPos._id.toString(),
        ...viewerRootAncestors.map((p) => p._id.toString()),
    ];

    const sponsorAncestors = await getAncestorChain(sponsorPos);
    const sponsorAncestorsIds = [
        sponsorPos._id.toString(),
        ...sponsorAncestors.map((p) => p._id.toString()),
    ];

    const rootId = viewerRootPos._id.toString();

    const sponsorIsAboveViewer = viewerRootAndAncestorsIds.includes(sponsorPos._id.toString());
    const sponsorIsBelowViewer = sponsorAncestorsIds.includes(rootId);

    if (sponsorIsAboveViewer) return "UPLINE_OVERFLOW";
    if (sponsorIsBelowViewer) return "BOTTOM_OVERFLOW";

    return "TEAM_MEMBER";
}

/* ------------------------ build tree node recursively ---------------------- */
async function buildTreeNode({ position, viewerUser, viewerRootPos, viewerRootAncestors, slot }) {
    const user = await User.findById(position.user).lean();

    const relation = await classifyNodeForViewer({
        viewerUser,
        viewerRootPos,
        viewerRootAncestors,
        nodePosition: position,
        slot,
    });

    const node = {
        positionId: position._id,
        userId: position.userId,
        walletAddress: user.walletAddress,
        depth: position.depth,
        cycleIndex: position.cycleIndex,
        isReentry: position.isReentry,
        relation, // SELF, DIRECT_PARTNER, UPLINE_OVERFLOW, BOTTOM_OVERFLOW, TEAM_MEMBER
        children: [],
    };

    if (position.children && position.children.length > 0) {
        const childPositions = await MatrixPosition.find({
            _id: { $in: position.children },
        }).sort({ createdAt: 1 });

        for (const child of childPositions) {
            const childNode = await buildTreeNode({
                position: child,
                viewerUser,
                viewerRootPos,
                viewerRootAncestors,
                slot,
            });
            node.children.push(childNode);
        }
    }

    return node;
}

/* -------------------------- public: get user tree -------------------------- */

export async function getUserTreeForSlot(userId, slotNumber, cycleIndex = 1) {
    const viewerUser = await User.findOne({ userId });
    if (!viewerUser) throw new Error("Viewer user not found");

    const slot = await Slot.findOne({ slotNumber });
    if (!slot) throw new Error("Slot not found");

    /* ------------------------------------------------------------  
       1️⃣ GET REAL SLOT ROOT (full matrix top)
    ------------------------------------------------------------ */
    const realRoot = await MatrixPosition.findOne({
        slot: slot._id,
        parentPosition: null
    }).sort({ createdAt: 1 });

    if (!realRoot) {
        return { slotNumber, userId, root: null, realParent: null };
    }

    /* ------------------------------------------------------------  
       2️⃣ Get ALL positions of viewer inside this slot
    ------------------------------------------------------------ */
    const allUserPositions = await MatrixPosition.find({
        user: viewerUser._id,
        slot: slot._id
    }).sort({ cycleIndex: 1 });

    // Viewer never placed in this slot
    if (allUserPositions.length === 0) {
        const fullTree = await buildTreeNode({
            position: realRoot,
            viewerUser,
            viewerRootPos: realRoot,
            viewerRootAncestors: [],
            slot
        });

        return {
            slotNumber,
            userId,
            root: fullTree,
            realParent: null
        };
    }

    /* ------------------------------------------------------------  
       3️⃣ Pick the correct cycle position
    ------------------------------------------------------------ */
    let viewerPos = allUserPositions.find(p => p.cycleIndex === Number(cycleIndex));

    if (!viewerPos) {
        viewerPos = allUserPositions[0];
    }

    /* ------------------------------------------------------------  
       4️⃣ Build subtree only from viewerPos (cycle tree)
    ------------------------------------------------------------ */
    const viewerAncestors = await getAncestorChain(viewerPos);

    const cycleTree = await buildTreeNode({
        position: viewerPos,
        viewerUser,
        viewerRootPos: viewerPos,
        viewerRootAncestors: viewerAncestors,
        slot
    });

    /* ------------------------------------------------------------  
       5️⃣ Get REAL parent of this cycle position
    ------------------------------------------------------------ */
    let realParent = null;

    if (viewerPos.parentPosition) {
        const parent = await MatrixPosition.findById(viewerPos.parentPosition);
        if (parent) {
            realParent = {
                userId: parent.userId,
                positionId: parent._id.toString()
            };
        }
    }

    /* ------------------------------------------------------------  
       6️⃣ Return final combined output
    ------------------------------------------------------------ */
    return {
        slotNumber,
        userId,
        cycleIndex,
        root: cycleTree,
        realParent: realParent
    };
}





