import { User, CommunityUser, Token } from '../generated/client'
type UserWithRelations = User & {
  CommunityUser: CommunityUser[];
  Token: Token | null;
};

function formatUserData(user: UserWithRelations | null) {
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
    token: user.Token ? {
      id: user.Token.id,
      refreshToken: user.Token.refreshToken,
      accessToken: user.Token.accessToken,
      createdAt: user.Token.createdAt?.toISOString(),
      salt: user.Token.salt,
    } : null,
  };
}

export default formatUserData;
