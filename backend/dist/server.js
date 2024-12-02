"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const protectedRoute_1 = __importDefault(require("./routes/protectedRoute"));
const chartRoutes_1 = __importDefault(require("./routes/chartRoutes"));
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const totalAmountRoutes_1 = __importDefault(require("./routes/totalAmountRoutes"));
const dataGetRoutes_1 = __importDefault(require("./routes/dataGetRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use('/api/auth', authRoutes_1.default);
app.use('/api', protectedRoute_1.default);
app.use('/api/charts', chartRoutes_1.default);
app.use('/api/data', dataRoutes_1.default);
app.use('/api/getData', dataGetRoutes_1.default);
app.use('/api/totalAmount', totalAmountRoutes_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
