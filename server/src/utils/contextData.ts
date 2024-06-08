import {lookup } from "geoip-lite";
import { Request } from 'express';
interface ContextData {
  ip: string;
  country: string;
  city: string;
  os: string;
  platform: string
  device: string;
  deviceType: string;
}
export const getIpFromHeaders = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  } else if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  } 
  return 'unknown';
};
const getCurrentContextData = (req: Request): ContextData => {
  const ip = getIpFromHeaders(req) || req.clientIp || (req.useragent?.geoIp ? req.useragent.geoIp.ip : 'unknown')|| 'unknown';
  const location = lookup(ip) || { country: 'unknown', city: 'unknown' };
  const country = location.country || 'unknown';
  const city = location.city || 'unknown';
  const platform = req.useragent?.platform || 'unknown';
  const os = req.useragent?.os || 'unknown';
  const device = req.useragent?.source || 'unknown';

  const deviceType = req.useragent?.isMobile
    ? 'Mobile'
    : req.useragent?.isDesktop
    ? 'Desktop'
    : req.useragent?.isTablet
    ? 'Tablet'
    : 'unknown';

  return {
    ip: ip.toString(),
    country,
    city,
    platform,
    os,
    device,
    deviceType,
  };
};

export default getCurrentContextData;
