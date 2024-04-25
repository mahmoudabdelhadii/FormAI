"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const request_ip_1 = __importDefault(require("request-ip"));
const users_1 = __importDefault(require("./routers/users"));
const port = process.env.PORT || 3000;
// app
const app = (0, express_1.default)();
// plugins
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express_1.default.json());
app.use(request_ip_1.default.mw());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// routers
app.use("/users", users_1.default);
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
exports.default = app;
//# sourceMappingURL=index.js.map