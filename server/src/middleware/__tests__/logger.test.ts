import { saveLogInfo } from '../logger';
import prisma from '../../utils/prisma';
import getCurrentContextData from '../../utils/contextData';
import { Request } from 'express';

// Mock the prisma client
jest.mock('../../utils/prisma', () => ({
  log: {
    create: jest.fn(),
  },
  logType: {
    findUnique: jest.fn(),
  },
  logLevel: {
    findUnique: jest.fn(),
  },
}));

// Mock the getCurrentContextData function
jest.mock('../../utils/contextData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('saveLogInfo', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      body: { email: 'test@example.com' },
      headers: {},
    };

    (getCurrentContextData as jest.Mock).mockReturnValue({
      ip: '127.0.0.1',
      country: 'Country',
      city: 'City',
      os: 'OS',
      device: 'Device',
      deviceType: 'DeviceType',
      platform: 'Platform',
    });

    (prisma.logType.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.logLevel.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save log info with context data when request is provided', async () => {
    await saveLogInfo(mockRequest as Request, 'Test message', 1, 1);

    expect(prisma.logType.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.logLevel.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(prisma.log.create).toHaveBeenCalledWith({
      data: {
        userId: 'test@example.com',
        contextId: 'IP: 127.0.0.1, Country: Country, City: City, Device Type: DeviceType, Platform: Platform, OS: OS, Device: Device',
        message: 'Test message',
        typeId: 1,
        levelId: 1,
      },
    });
  });

  it('should save log info without context data when request is not provided', async () => {
    await saveLogInfo(null, 'Test message', 1, 1);

    expect(prisma.logType.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.logLevel.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(prisma.log.create).toHaveBeenCalledWith({
      data: {
        userId: null,
        contextId: null,
        message: 'Test message',
        typeId: 1,
        levelId: 1,
      },
    });
  });

  it('should log an error if saving log info fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (prisma.log.create as jest.Mock).mockRejectedValue(new Error('Test error'));

    await saveLogInfo(mockRequest as Request, 'Test message', 1, 1);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving log info:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
