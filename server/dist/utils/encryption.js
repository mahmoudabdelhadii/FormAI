"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const key = process.env.CRYPTO_KEY;
const iv = crypto_js_1.default.lib.WordArray.random(16);
const encryptData = (data) => {
    return crypto_js_1.default.AES.encrypt(data, key, {
        iv: iv,
    }).toString();
};
exports.encryptData = encryptData;
const decryptData = (encryptedData) => {
    return crypto_js_1.default.AES.decrypt(encryptedData, key, {
        iv: iv,
    }).toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptData = decryptData;
//# sourceMappingURL=encryption.js.map