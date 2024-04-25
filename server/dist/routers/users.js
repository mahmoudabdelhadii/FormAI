"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.get("/community/:communityId", admin_controller_1.getCommunity);
router.get("/communities", admin_controller_1.getCommunities);
router.get("/moderators/:communityId", admin_controller_1.getModerators);
router.patch("/add-moderators", admin_controller_1.addModerator);
exports.default = router;
//# sourceMappingURL=users.js.map