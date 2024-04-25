"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const generateConfirmationToken = (userId) => {
    const currentTime = Date.now().toString();
    const tokenData = `${currentTime}${userId}`;
    return (0, crypto_1.createHash)("sha256").update(tokenData).digest("hex");
};
exports.default = generateConfirmationToken;
//# sourceMappingURL=confirmationToken.js.map