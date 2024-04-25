"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const userController = {
    getUsers: (req, res, next) => {
        const users = users_1.default.getUsers();
        res.send(users);
    },
};
exports.default = userController;
//# sourceMappingURL=users.js.map