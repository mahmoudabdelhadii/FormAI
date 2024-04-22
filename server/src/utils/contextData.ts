import {lookup } from "geoip-lite";
const getCurrentContextData = (req:any) => {
  const ip = req.clientIp || "unknown";
  const location = lookup(ip);
  const country = location?.country ? location.country.toString() : "unknown";
  const city = location?.city ? location.city.toString() : "unknown";
  const os = req.useragent?.os ? req.useragent.os.toString() : "unknown";
  const device = req.useragent?.device
    ? req.useragent.device.toString()
    : "unknown";

  const isMobile = req.useragent?.isMobile || false;
  const isDesktop = req.useragent?.isDesktop || false;
  const isTablet = req.useragent?.isTablet || false;

  const deviceType = isMobile
    ? "Mobile"
    : isDesktop
    ? "Desktop"
    : isTablet
    ? "Tablet"
    : "unknown";
  return { ip, country, city, os, device, deviceType };
};

export default getCurrentContextData;
