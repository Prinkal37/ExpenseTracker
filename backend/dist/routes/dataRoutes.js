"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const dataController_1 = require("../controllers/dataController");
const router = express_1.default.Router();
router.post('/Debit', authMiddleware_1.default, dataController_1.createDebit);
router.post('/Credit', authMiddleware_1.default, dataController_1.createCredit);
router.post('/Debt', authMiddleware_1.default, dataController_1.createDebt);
router.post('/Receivable', authMiddleware_1.default, dataController_1.createReceivable);
router.post('/UpdateStatus', authMiddleware_1.default, dataController_1.updateDebtOrReceivable);
exports.default = router;
