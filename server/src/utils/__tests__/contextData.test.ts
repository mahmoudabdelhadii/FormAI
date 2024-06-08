import { lookup } from "geoip-lite";
import { Request } from 'express';
import getCurrentContextData, { getIpFromHeaders } from '../contextData';

// Mock geoip-lite
jest.mock('geoip-lite', () => ({
  lookup: jest.fn(),
}));

// Mock useragent
const mockUserAgent = {
  platform: 'Windows',
  os: 'Windows 10',
  source: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  isMobile: false,
  isDesktop: true,
  isTablet: false,
  geoIp: { ip: '127.0.0.1' }
};

describe('getIpFromHeaders', () => {
  it('should return the first IP from x-forwarded-for header if it is an array', () => {
    const req = {
      headers: {
        'x-forwarded-for': ['203.0.113.1', '198.51.100.1']
      }
    } as Partial<Request>;

    expect(getIpFromHeaders(req as Request)).toBe('203.0.113.1');
  });

  it('should return the first IP from x-forwarded-for header if it is a string', () => {
    const req = {
      headers: {
        'x-forwarded-for': '203.0.113.1, 198.51.100.1'
      }
    } as Partial<Request>;

    expect(getIpFromHeaders(req as Request)).toBe('203.0.113.1');
  });

  it('should return "unknown" if x-forwarded-for header is not present', () => {
    const req = {
      headers: {}
    } as Partial<Request>;

    expect(getIpFromHeaders(req as Request)).toBe('unknown');
  });
});

// describe('getCurrentContextData', () => {
//   it('should return context data based on request headers and useragent', () => {
//     const req = {
//       headers: {
//         'x-forwarded-for': '203.0.113.1'
//       },
//       useragent: mockUserAgent,
//     } as Partial<Request>;

//     (lookup as jest.Mock).mockReturnValue({ country: 'US', city: 'Los Angeles' });

//     const contextData = getCurrentContextData(req as Request);

//     expect(contextData).toEqual({
//       ip: '203.0.113.1',
//       country: 'US',
//       city: 'Los Angeles',
//       platform: 'Windows',
//       os: 'Windows 10',
//       device: mockUserAgent.source,
//       deviceType: 'Desktop'
//     });
//   });

//   it('should return "unknown" for fields if information is missing', () => {
//     const req = {
//       headers: {},
//       useragent: {},
//     } as Partial<Request>;

//     (lookup as jest.Mock).mockReturnValue(null);

//     const contextData = getCurrentContextData(req as Request);

//     expect(contextData).toEqual({
//       ip: 'unknown',
//       country: 'unknown',
//       city: 'unknown',
//       platform: 'unknown',
//       os: 'unknown',
//       device: 'unknown',
//       deviceType: 'unknown',
//     });
//   });

//   it('should use clientIp if available in req', () => {
//     const req = {
//       headers: {},
//       clientIp: '192.168.1.1',
//       useragent: mockUserAgent,
//     } as Partial<Request>;

//     (lookup as jest.Mock).mockReturnValue({ country: 'US', city: 'San Francisco' });

//     const contextData = getCurrentContextData(req as Request);

//     expect(contextData).toEqual({
//       ip: '192.168.1.1',
//       country: 'US',
//       city: 'San Francisco',
//       platform: 'Windows',
//       os: 'Windows 10',
//       device: mockUserAgent.source,
//       deviceType: 'Desktop',
//     });
//   });

//   it('should use geoIp from useragent if available', () => {
//     const req = {
//       headers: {},
//       useragent: { ...mockUserAgent, geoIp: { ip: '203.0.113.1' } },
//     } as Partial<Request>;

//     (lookup as jest.Mock).mockReturnValue({ country: 'CA', city: 'Toronto' });

//     const contextData = getCurrentContextData(req as Request);

//     expect(contextData).toEqual({
//       ip: '203.0.113.1',
//       country: 'CA',
//       city: 'Toronto',
//       platform: 'Windows',
//       os: 'Windows 10',
//       device: mockUserAgent.source,
//       deviceType: 'Desktop',
//     });
//   });
// });
