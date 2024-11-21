"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDebtOrReceivable = exports.createReceivable = exports.createDebt = exports.createCredit = exports.createDebit = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDebit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { money, description, category } = req.body;
    if (!req.user) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const debit = yield prisma.debit.create({
            data: {
                money,
                description,
                category,
                date: new Date(),
                totalAmount: {
                    connect: { userId: req.user.id },
                },
            },
        });
        yield prisma.totalAmount.update({
            where: { userId: req.user.id },
            data: {
                total: {
                    decrement: money,
                },
            },
        });
        res.status(201).json({ message: 'Debit entry created successfully', debit });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating debit entry' });
    }
});
exports.createDebit = createDebit;
const createCredit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { money, description, category } = req.body;
    if (!req.user) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const credit = yield prisma.credit.create({
            data: {
                money,
                description,
                category,
                date: new Date(),
                totalAmount: {
                    connect: { userId: req.user.id },
                },
            },
        });
        yield prisma.totalAmount.update({
            where: { userId: req.user.id },
            data: {
                total: {
                    increment: money,
                },
            },
        });
        res.status(201).json({ message: 'Credit entry created successfully', credit });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating credit entry' });
    }
});
exports.createCredit = createCredit;
const createDebt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { money, description, status } = req.body;
    if (!req.user) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const debt = yield prisma.debt.create({
            data: {
                money,
                description,
                status: status || false,
                date: new Date(),
                totalAmount: {
                    connect: { userId: req.user.id },
                },
            },
        });
        if (debt.status) {
            yield prisma.totalAmount.update({
                where: { userId: req.user.id },
                data: {
                    total: {
                        decrement: money,
                    },
                },
            });
        }
        res.status(201).json({ message: 'Debt entry created successfully', debt });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating debt entry' });
    }
});
exports.createDebt = createDebt;
const createReceivable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { money, description, status } = req.body;
    if (!req.user) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const receivable = yield prisma.receivable.create({
            data: {
                money,
                description,
                status: status || false,
                date: new Date(),
                totalAmount: {
                    connect: { userId: req.user.id },
                },
            },
        });
        if (receivable.status) {
            yield prisma.totalAmount.update({
                where: { userId: req.user.id },
                data: {
                    total: {
                        increment: money,
                    },
                },
            });
        }
        res.status(201).json({ message: 'Receivable entry created successfully', receivable });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating receivable entry' });
    }
});
exports.createReceivable = createReceivable;
const updateDebtOrReceivable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { status, entryId, entryType } = req.body;
    if (!entryType || !["receivable", "debt"].includes(entryType)) {
        res.status(400).json({ message: "Invalid or missing entryType" });
        return;
    }
    try {
        const existingEntry = entryType === "receivable"
            ? yield prisma.receivable.findUnique({ where: { id: entryId } })
            : yield prisma.debt.findUnique({ where: { id: entryId } });
        if (!existingEntry) {
            res.status(404).json({ message: `${entryType} not found` });
            return;
        }
        if (typeof existingEntry.money !== "number") {
            res.status(400).json({ message: "Invalid money value" });
            return;
        }
        let increment = 0;
        if (entryType === "debt") {
            increment = status ? -existingEntry.money : existingEntry.money;
        }
        else if (entryType === "receivable") {
            increment = status ? existingEntry.money : -existingEntry.money;
        }
        if (existingEntry.status !== status) {
            yield prisma.totalAmount.update({
                where: {
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: {
                    total: {
                        increment,
                    },
                },
            });
        }
        const updatedEntry = entryType === "receivable"
            ? yield prisma.receivable.update({
                where: { id: entryId },
                data: { status },
            })
            : yield prisma.debt.update({
                where: { id: entryId },
                data: { status },
            });
        res.status(200).json({ message: "Status updated successfully", updatedEntry });
    }
    catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
exports.updateDebtOrReceivable = updateDebtOrReceivable;
