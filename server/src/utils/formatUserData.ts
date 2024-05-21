
import { User, CommunityUser, Token } from '@prisma/client';


 function formatUserData(user: User & {
    CommunityUser: CommunityUser[];
    Token: Token[];
  } | null) {
    if (!user) {
      return null;
    }
  
    return {
      id: user.id,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatarUrl: user.avatarUrl || 'No avatar available',
      bio: user.bio || 'No bio available',
      createdAt: user.createdAt?.toISOString() || 'No creation date available',
      isEmailVerified: user.isEmailVerified ? 'Yes' : 'No',
      physicalAttributes: {
        height: user.height ? `${user.height} meters` : 'No height available',
        weight: user.weight ? `${user.weight} kg` : 'No weight available',
        age: user.age ? `${user.age} years old` : 'No age available',
      },
      communityMemberships: user.CommunityUser.map(cu => ({
        communityId: cu.community,
        role: cu.role,
        verifiedAt: cu.verifiedAt?.toISOString(),
      })),
      tokens: user.Token.map(token => ({
        id: token.id,
        user: token.user,
        refreshToken: token.refreshToken,
        accessToken: token.accessToken,
        createdAt: token.createdAt?.toISOString(),
        salt: token.salt,
      })),
    };
  }

  export default formatUserData