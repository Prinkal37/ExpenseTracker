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
exports.updateTotalAmount = exports.getTotalAmount = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTotalAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(400).json({ message: 'User ID is required.' });
        return;
    }
    try {
        const totalAmount = yield prisma.totalAmount.findUnique({
            where: { userId },
        });
        if (!totalAmount) {
            res.status(404).json({ message: 'Total amount not found for this user.' });
            return;
        }
        res.status(200).json(totalAmount);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch total amount', error });
    }
});
exports.getTotalAmount = getTotalAmount;
const updateTotalAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { total } = req.body;
    if (!userId) {
        res.status(400).json({ message: 'User ID is required.' });
        return;
    }
    if (total === undefined) {
        res.status(400).json({ message: 'Total amount is required.' });
        return;
    }
    try {
        const existingTotalAmount = yield prisma.totalAmount.findUnique({
            where: { userId },
        });
        if (!existingTotalAmount) {
            const newTotalAmount = yield prisma.totalAmount.create({
                data: {
                    total,
                    user: {
                        connect: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id },
                    },
                },
            });
            res.status(201).json(newTotalAmount);
        }
        else {
            const updatedTotalAmount = yield prisma.totalAmount.update({
                where: { userId },
                data: { total },
            });
            res.status(200).json(updatedTotalAmount);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update total amount', error });
    }
});
exports.updateTotalAmount = updateTotalAmount;
