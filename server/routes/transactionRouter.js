import express from "express";
import Transaction from "../models/TransactionSchema.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];  //  Extract Bearer token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};



// Fetch Transactions for Logged-in User
router.get("/", verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Add New Transaction
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, amount, category, type, date, description } = req.body;
        const newTransaction = new Transaction({ userId: req.userId, title, amount, category, type, date, description });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Ensure user can only delete their own transactions
        if (transaction.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this transaction" });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { title, amount, category, type, date, description } = req.body;

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Ensure the logged-in user is updating their own transaction
        if (transaction.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to update this transaction" });
        }

        // Update transaction
        transaction.title = title;
        transaction.amount = amount;
        transaction.category = category;
        transaction.type = type;
        transaction.date = date;
        transaction.description = description;

        await transaction.save();
        res.json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
