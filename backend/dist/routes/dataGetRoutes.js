"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const dataGetController_1 = require("../controllers/dataGetController");
const router = express_1.default.Router();
router.get('/debits', authMiddleware_1.default, dataGetController_1.getDebits);
router.get('/credits', authMiddleware_1.default, dataGetController_1.getCredits);
router.get('/debts', authMiddleware_1.default, dataGetController_1.getDebts);
router.get('/receivables', authMiddleware_1.default, dataGetController_1.getReceivables);
exports.default = router;
