import { Claim } from "../models/claim.model.js";
import User from "../models/user.model.js"
import { FoundItem } from "../models/foundItem.model.js"; // adjust if needed
import { sendClaimNotificationToOwner, sendApprovalToClaimer, sendRejectionToClaimer } from "../utils/claimEmail.js";
import axios from "axios";

export const createClaim = async (req, res) => {
    try {
        const {
            itemId,
            itemName,
            description,
            lastSeenLocation,
            lastSeenDate,
            additionalNote,
            brand,
            color,
            uniqueMark,
            exactLocation,
        } = req.body;

        // 🔹 Get item
        const item = await FoundItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // 🔹 Prevent self-claim
        if (item.user.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot claim your own item" });
        }

        // 🔹 Prevent duplicate claim
        const existing = await Claim.findOne({
            item: itemId,
            claimant: req.user._id,
        });

        if (existing) {
            return res.status(400).json({ message: "You already claimed this item" });
        }
        // 🔥 Prepare data for AI
        const itemForAI = {
            itemName: item.itemName?.toLowerCase(),
            description: item.description?.toLowerCase(),
            location: (item.location || item.lastSeenLocation)?.toLowerCase(),
        };

        const claimForAI = {
            itemName: itemName?.toLowerCase(),
            description: description?.toLowerCase(),
            location: lastSeenLocation?.toLowerCase(),
        };

        let match_score = 50;
        let reason = "AI unavailable";

        try {
            const aiResponse = await axios.post(
                process.env.AI_URL + "/match-claim",
                {
                    item: itemForAI,
                    claim: claimForAI,
                },
                {
                    timeout: 10000,
                }
            );

            match_score = Number(aiResponse.data.match_score) || 50;
            reason = aiResponse.data.reason ?? "No reason provided";

        } catch (err) {
            console.error("AI ERROR:", err.message);
            match_score = 40;
            reason = "AI fallback used";
        }

        // 🔥 Decide status
        const normalize = (text) => text?.toLowerCase().trim();

        let matchCount = 0;
        let totalChecks = 0;

        // 🔒 Brand
        if (brand && item.brand) {
            totalChecks++;
            if (normalize(item.brand).includes(normalize(brand))) {
                matchCount++;
            }
        }

        // 🎨 Color
        if (color && item.color) {
            totalChecks++;
            if (normalize(item.color).includes(normalize(color))) {
                matchCount++;
            }
        }

        // 🧩 Unique mark
        if (uniqueMark && item.uniqueMark) {
            totalChecks++;
            if (normalize(item.uniqueMark).includes(normalize(uniqueMark))) {
                matchCount++;
            }
        }

        // 📍 Location (LOW IMPORTANCE → optional)
        if (exactLocation && item.exactLocation) {
            totalChecks++;
            if (normalize(item.exactLocation).includes(normalize(exactLocation))) {
                matchCount++;
            }
        }

        // 🚫 Prevent negative / overflow
        let finalScore = match_score; // start from AI

        // Add based on how many matched
        if (matchCount === 1) finalScore = Math.max(finalScore, 50);
        if (matchCount === 2) finalScore = Math.max(finalScore, 60);
        if (matchCount === 3) finalScore = Math.max(finalScore, 75);
        if (matchCount >= 4) finalScore = Math.max(finalScore, 85);

        // 🔥 PENALTY FOR WRONG ANSWERS
        let penalty = 0;

        if (brand && item.brand && !normalize(item.brand).includes(normalize(brand))) {
            penalty += 15;
        }

        if (color && item.color && !normalize(item.color).includes(normalize(color))) {
            penalty += 10;
        }

        // Apply penalty
        finalScore = finalScore - penalty;

        // Clamp
        finalScore = Math.max(0, Math.min(finalScore, 100));
        let wrongAnswers = 0;

        if (brand && normalize(brand) !== normalize(item.brand)) wrongAnswers++;
        if (color && normalize(color) !== normalize(item.color)) wrongAnswers++;
        // 🔥 Final decision
        let status = "review";

        if (finalScore >= 85 && penalty === 0) {
            status = "matched"; // only if no wrong answers
        } else if (finalScore >= 50) {
            status = "review";
        } else {
            status = "rejected";
        }
        // 🔹 Create claim
        const claim = await Claim.create({
            item: itemId,
            claimant: req.user._id,
            owner: item.user,

            claimerName: req.user.name,
            claimerEmail: req.user.email,

            itemName,
            description,
            lastSeenLocation,
            lastSeenDate,
            additionalNote,
            matchScore: finalScore,
            aiReason: reason,
            status, // 👈 AI decides this
            answers: {
                brand,
                color,
                uniqueMark,
                exactLocation,
            },
        });

        const owner = await User.findById(item.user);

        await sendClaimNotificationToOwner({
            ownerEmail: owner.email,
            itemName: item.itemName,
            score: finalScore,
            status,
        });

        res.status(201).json({
            success: true,
            data: claim,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        console.error("AI ERROR:", err.response?.data || err.message);
    }
};

export const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ owner: req.user._id })
            .populate("claimant", "name email")
            .populate("item");

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const approveClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        // Only owner can approve
        if (claim.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        claim.status = "approved";
        await claim.save();

        const claimant = await User.findById(claim.claimant);

        await sendApprovalToClaimer({
            email: claimant.email,
            itemName: claim.itemName,
        });

        res.json({ success: true, data: claim });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const rejectClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        if (claim.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        claim.status = "rejected";
        await claim.save();

        const claimant = await User.findById(claim.claimant);

        await sendRejectionToClaimer({
            email: claimant.email,
            itemName: claim.itemName,
        });

        res.json({ success: true, data: claim });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getClaimsMadeByMe = async (req, res) => {
    try {
        const claims = await Claim.find({ claimant: req.user._id })
            .populate("item")
            .populate("owner", "name email phone");

        res.status(200).json({
            success: true,
            data: claims,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
