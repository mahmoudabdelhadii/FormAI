"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addModerator = exports.getModerators = exports.getCommunity = exports.getCommunities = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const communities = yield prisma_1.default.community.findMany();
        res.status(200).json(communities);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving communities" });
    }
});
exports.getCommunities = getCommunities;
const getCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { communityId } = req.params;
        const community = yield prisma_1.default.community.findFirst({
            relationLoadStrategy: 'join',
            where: {
                id: parseInt(communityId),
            },
            include: {
                CommunityRequest: {
                    select: {
                        id: true,
                        user: true,
                        requestedAt: true,
                        message: true
                    }
                },
                CommunityUser: {
                    select: {
                        user: true,
                        verifiedAt: true,
                        UserRoles: {
                            select: {
                                role: true
                            }
                        },
                    }
                },
                BannedUsers: true,
            },
        });
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }
        const moderatorCount = community.CommunityUser;
        // const memberCount = community.members.length;
        // const formattedCommunity = {
        //   ...community,
        //   memberCount,
        //   moderatorCount,
        // };
        res.status(200).json(community);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving community" });
    }
});
exports.getCommunity = getCommunity;
const getModerators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { communityId } = req.params;
        const moderators = yield prisma_1.default.communityUser.findMany({
            where: {
                community: parseInt(communityId),
                role: 2
            },
            include: {
                UserRoles: {
                    select: {
                        role: true,
                    },
                }
            }
        });
        res.status(200).json(moderators);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving moderators" });
    }
});
exports.getModerators = getModerators;
const addModerator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { communityId, moderatorId } = req.query;
        if (!communityId) {
            return res.status(404).json({ message: "no community id provided" });
        }
        const community = yield prisma_1.default.communityUser.findMany({
            where: {
                community: parseInt(communityId.toString()),
                role: 2
            },
            select: {
                user: true
            }
        });
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }
        const existingModerator = community;
        console.log(existingModerator);
        if (existingModerator) {
            return res.status(400).json(community);
        }
        // community.moderators.push(moderatorId);
        // community.members.push(moderatorId);
        // await community.save();
        res.status(200).json({ message: "Moderator added" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding moderator" });
    }
});
exports.addModerator = addModerator;
//# sourceMappingURL=admin.controller.js.map