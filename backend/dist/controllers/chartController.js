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
exports.getPieChartData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPieChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ message: 'User ID not found.' });
            return;
        }
        const userTotalAmount = yield prisma.totalAmount.findUnique({
            where: { userId },
        });
        if (!userTotalAmount) {
            res.status(404).json({ message: 'TotalAmount not found for the user.' });
            return;
        }
        const debitSummary = yield prisma.debit.groupBy({
            where: {
                totalAmountId: userTotalAmount.id,
            },
            by: ['category'],
            _sum: {
                money: true,
            },
        });
        const creditSummary = yield prisma.credit.groupBy({
            where: {
                totalAmountId: userTotalAmount.id,
            },
            by: ['category'],
            _sum: {
                money: true,
            },
        });
        const pieChartData = {
            debit: debitSummary.map((item) => {
                var _a;
                return ({
                    category: item.category,
                    total: (_a = item._sum.money) !== null && _a !== void 0 ? _a : 0,
                });
            }),
            credit: creditSummary.map((item) => {
                var _a;
                return ({
                    category: item.category,
                    total: (_a = item._sum.money) !== null && _a !== void 0 ? _a : 0,
                });
            }),
        };
        res.status(200).json(pieChartData);
    }
    catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getPieChartData = getPieChartData;
