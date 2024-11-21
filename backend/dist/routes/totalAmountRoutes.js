"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const totalAmountController_1 = require("../controllers/totalAmountController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, totalAmountController_1.getTotalAmount);
router.put('/', authMiddleware_1.default, totalAmountController_1.updateTotalAmount);
exports.default = router;
