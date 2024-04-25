"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = require("geoip-lite");
const getCurrentContextData = (req) => {
    var _a, _b, _c, _d, _e;
    const ip = req.clientIp || "unknown";
    const location = (0, geoip_lite_1.lookup)(ip);
    const country = (location === null || location === void 0 ? void 0 : location.country) ? location.country.toString() : "unknown";
    const city = (location === null || location === void 0 ? void 0 : location.city) ? location.city.toString() : "unknown";
    const os = ((_a = req.useragent) === null || _a === void 0 ? void 0 : _a.os) ? req.useragent.os.toString() : "unknown";
    const device = ((_b = req.useragent) === null || _b === void 0 ? void 0 : _b.device)
        ? req.useragent.device.toString()
        : "unknown";
    const isMobile = ((_c = req.useragent) === null || _c === void 0 ? void 0 : _c.isMobile) || false;
    const isDesktop = ((_d = req.useragent) === null || _d === void 0 ? void 0 : _d.isDesktop) || false;
    const isTablet = ((_e = req.useragent) === null || _e === void 0 ? void 0 : _e.isTablet) || false;
    const deviceType = isMobile
        ? "Mobile"
        : isDesktop
            ? "Desktop"
            : isTablet
                ? "Tablet"
                : "unknown";
    return { ip, country, city, os, device, deviceType };
};
exports.default = getCurrentContextData;
//# sourceMappingURL=contextData.js.map