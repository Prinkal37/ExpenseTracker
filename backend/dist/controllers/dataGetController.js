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
exports.getReceivables = exports.getDebts = exports.getCredits = exports.getDebits = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDebits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const debits = yield prisma.debit.findMany({
            where: {
                totalAmount: { userId: userId },
                deleted: false,
            },
        });
        res.status(200).json(debits);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching debit entries' });
    }
});
exports.getDebits = getDebits;
const getCredits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const credits = yield prisma.credit.findMany({
            where: {
                totalAmount: { userId: userId },
                deleted: false,
            },
        });
        res.status(200).json(credits);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching credit entries' });
    }
});
exports.getCredits = getCredits;
const getDebts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const debts = yield prisma.debt.findMany({
            where: {
                totalAmount: { userId: userId },
                deleted: false,
            },
        });
        res.status(200).json(debts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching debt entries' });
    }
});
exports.getDebts = getDebts;
const getReceivables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }
    try {
        const receivables = yield prisma.receivable.findMany({
            where: {
                totalAmount: { userId: userId },
                deleted: false,
            },
        });
        res.status(200).json(receivables);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receivable entries' });
    }
});
exports.getReceivables = getReceivables;
