"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, } = require('./runtime/index-browser.js');
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 5.12.1
 * Query Engine version: 473ed3124229e22d881cb7addf559799debae1ab
 */
Prisma.prismaVersion = {
    client: "5.12.1",
    engine: "473ed3124229e22d881cb7addf559799debae1ab"
};
Prisma.PrismaClientKnownRequestError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.NotFoundError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
/**
* Extensions
*/
Prisma.getExtensionContext = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.AdminScalarFieldEnum = {
    id: 'id',
    username: 'username',
    password: 'password'
};
exports.Prisma.RelationLoadStrategy = {
    query: 'query',
    join: 'join'
};
exports.Prisma.AdminTokenScalarFieldEnum = {
    id: 'id',
    user: 'user',
    accessToken: 'accessToken'
};
exports.Prisma.BannedUsersScalarFieldEnum = {
    id: 'id',
    community: 'community',
    user: 'user',
    reasonId: 'reasonId'
};
exports.Prisma.CommentScalarFieldEnum = {
    id: 'id',
    body: 'body',
    user: 'user',
    post: 'post'
};
exports.Prisma.CommunityScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description'
};
exports.Prisma.CommunityRequestScalarFieldEnum = {
    id: 'id',
    user: 'user',
    community: 'community',
    requestedAt: 'requestedAt',
    message: 'message'
};
exports.Prisma.ContextScalarFieldEnum = {
    id: 'id',
    user: 'user',
    ip: 'ip',
    country: 'country',
    city: 'city',
    os: 'os',
    device: 'device',
    deviceType: 'deviceType',
    isTrusted: 'isTrusted'
};
exports.Prisma.LikeScalarFieldEnum = {
    id: 'id',
    user: 'user',
    post: 'post'
};
exports.Prisma.LogScalarFieldEnum = {
    id: 'id',
    user: 'user',
    context: 'context',
    message: 'message',
    type: 'type',
    level: 'level',
    timestamp: 'timestamp'
};
exports.Prisma.PendingPostScalarFieldEnum = {
    id: 'id',
    Content: 'Content',
    fileUrl: 'fileUrl',
    community: 'community',
    user: 'user',
    caption: 'caption',
    status: 'status',
    confirmationToken: 'confirmationToken'
};
exports.Prisma.PostScalarFieldEnum = {
    id: 'id',
    Content: 'Content',
    fileUrl: 'fileUrl',
    community: 'community',
    user: 'user',
    caption: 'caption'
};
exports.Prisma.PreferencesScalarFieldEnum = {
    id: 'id',
    user: 'user',
    enableContextBasedAuth: 'enableContextBasedAuth'
};
exports.Prisma.RelationshipScalarFieldEnum = {
    id: 'id',
    follower: 'follower',
    following: 'following'
};
exports.Prisma.ReportScalarFieldEnum = {
    id: 'id',
    reportedBy: 'reportedBy',
    post: 'post',
    community: 'community',
    reportReason: 'reportReason',
    reportDate: 'reportDate'
};
exports.Prisma.TokenScalarFieldEnum = {
    id: 'id',
    user: 'user',
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    createdAt: 'createdAt'
};
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    password: 'password',
    avatarUrl: 'avatarUrl',
    bio: 'bio',
    createdAt: 'createdAt',
    isEmailVerified: 'isEmailVerified',
    height: 'height',
    weight: 'weight',
    age: 'age'
};
exports.Prisma.UserRolesScalarFieldEnum = {
    id: 'id',
    role: 'role'
};
exports.Prisma.EmailScalarFieldEnum = {
    id: 'id',
    email: 'email',
    verificationCode: 'verificationCode',
    messageId: 'messageId',
    for: 'for',
    createdAt: 'createdAt'
};
exports.Prisma.EmailForScalarFieldEnum = {
    id: 'id',
    for: 'for'
};
exports.Prisma.LeaderboardScalarFieldEnum = {
    id: 'id',
    community: 'community'
};
exports.Prisma.LeaderboardSubmissionScalarFieldEnum = {
    id: 'id',
    user: 'user',
    community: 'community',
    entryUrl: 'entryUrl',
    verifiedBy: 'verifiedBy',
    weight: 'weight',
    type: 'type',
    verifiedAt: 'verifiedAt',
    rank: 'rank',
    leaderboardId: 'leaderboardId'
};
exports.Prisma.LeaderboardSubmissionTypeScalarFieldEnum = {
    id: 'id',
    type: 'type',
    leaderboardSubmissionId: 'leaderboardSubmissionId'
};
exports.Prisma.PendingPostStatusScalarFieldEnum = {
    id: 'id',
    status: 'status'
};
exports.Prisma.LogLevelScalarFieldEnum = {
    id: 'id',
    level: 'level'
};
exports.Prisma.LogTypeScalarFieldEnum = {
    id: 'id',
    type: 'type'
};
exports.Prisma.SuspiciousLoginScalarFieldEnum = {
    id: 'id',
    user: 'user',
    ip: 'ip',
    country: 'country',
    city: 'city',
    os: 'os',
    device: 'device',
    deviceType: 'deviceType',
    isTrusted: 'isTrusted',
    unverifiedAttempts: 'unverifiedAttempts',
    isBlocked: 'isBlocked'
};
exports.Prisma.CommunityUserScalarFieldEnum = {
    id: 'id',
    community: 'community',
    user: 'user',
    role: 'role',
    verifiedAt: 'verifiedAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.ModelName = {
    Admin: 'Admin',
    AdminToken: 'AdminToken',
    BannedUsers: 'BannedUsers',
    Comment: 'Comment',
    Community: 'Community',
    CommunityRequest: 'CommunityRequest',
    Context: 'Context',
    Like: 'Like',
    Log: 'Log',
    PendingPost: 'PendingPost',
    Post: 'Post',
    Preferences: 'Preferences',
    Relationship: 'Relationship',
    Report: 'Report',
    Token: 'Token',
    User: 'User',
    UserRoles: 'UserRoles',
    Email: 'Email',
    EmailFor: 'EmailFor',
    Leaderboard: 'Leaderboard',
    LeaderboardSubmission: 'LeaderboardSubmission',
    LeaderboardSubmissionType: 'LeaderboardSubmissionType',
    PendingPostStatus: 'PendingPostStatus',
    LogLevel: 'LogLevel',
    LogType: 'LogType',
    SuspiciousLogin: 'SuspiciousLogin',
    CommunityUser: 'CommunityUser'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
    constructor() {
        return new Proxy(this, {
            get(target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                }
                else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
//# sourceMappingURL=wasm.js.map