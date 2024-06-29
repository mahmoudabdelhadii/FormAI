import { User, CommunityUser, Token } from '../../generated/client';
import formatUserData from '../formatUserData';

describe('formatUserData', () => {
    it('should return null if user is null', () => {
      expect(formatUserData(null)).toBeNull();
    });
  
    it('should format user data correctly with all fields populated', () => {
      const user: User & {
        CommunityUser: CommunityUser[];
        Token: Token | null;
      } = {
        id: '1',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'http://example.com/avatar.jpg',
        password: 'password',
        bio: 'Software Developer',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        isEmailVerified: true,
        height: 1.8,
        weight: 75,
        age: 30,
        gender: 'male',
        dateOfBirth: new Date('1990-01-01T00:00:00Z'),
        CommunityUser: [
          {
            id: 'communityUser1',
            communityId: 'community1',
            userId: '1',
            roleId: 1,
            verifiedAt: new Date('2022-01-01T00:00:00Z'),
          },
        ],
        Token: {
          id: 'token1',
          userId: 'user-ID',
          refreshToken: 'refresh-token',
          accessToken: 'access-token',
          createdAt: new Date('2022-01-01T00:00:00Z'),
          accessTokenExpiresAt: new Date('2022-01-01T00:00:00Z'),
          refreshTokenExpiresAt: new Date('2022-01-01T00:00:00Z'),
        },
      };
  
      const expected = {
        id: '1',
        username: 'johndoe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'http://example.com/avatar.jpg',
        bio: 'Software Developer',
        createdAt: '2022-01-01T00:00:00.000Z',
        isEmailVerified: 'Yes',
        physicalAttributes: {
          height: '1.8 meters',
          weight: '75 kg',
          age: '30 years old',
        },
        communityMemberships: [
          {
            communityId: 'community1',
            role: 1,
            verifiedAt: '2022-01-01T00:00:00.000Z',
          },
        ],
        token: {
          id: 'token1',
          refreshToken: 'refresh-token',
          accessToken: 'access-token',
          createdAt: '2022-01-01T00:00:00.000Z',
          accessTokenExpiresAt: '2022-01-01T00:00:00.000Z',
          refreshTokenExpiresAt: '2022-01-01T00:00:00.000Z',
        },
      };
  
      expect(formatUserData(user)).toEqual(expected);
    });
  
    it('should handle missing optional fields gracefully', () => {
      const user: User & {
        CommunityUser: CommunityUser[];
        Token: Token | null;
      } = {
        id: '1',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        avatarUrl: null,
        bio: null,
        createdAt: null,
        isEmailVerified: false,
        height: null,
        weight: null,
        age: null,
        gender: null,
        dateOfBirth: null,
        CommunityUser: [],
        Token: null,
      };
  
      const expected = {
        id: '1',
        username: 'johndoe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'No avatar available',
        bio: 'No bio available',
        createdAt: 'No creation date available',
        isEmailVerified: 'No',
        physicalAttributes: {
          height: 'No height available',
          weight: 'No weight available',
          age: 'No age available',
        },
        communityMemberships: [],
        token: null,
      };
  
      expect(formatUserData(user)).toEqual(expected);
    });
  });