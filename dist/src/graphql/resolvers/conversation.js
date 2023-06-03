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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationPopulated = exports.participantPopulated = void 0;
var client_1 = require("@prisma/client");
var graphql_1 = require("graphql");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var functions_1 = require("../../util/functions");
var resolvers = {
    Query: {
        conversations: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, tokenPayload, code, payload, userId, conversations, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, tokenPayload = context.tokenPayload;
                        code = tokenPayload.code, payload = tokenPayload.payload;
                        if (code !== 200) {
                            throw new graphql_1.GraphQLError('You are not authorized to perform this action.', {
                                extensions: {
                                    code: code,
                                },
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        userId = payload === null || payload === void 0 ? void 0 : payload.userId;
                        return [4 /*yield*/, prisma.conversation.findMany({
                                where: {
                                    participants: {
                                        some: {
                                            userId: {
                                                equals: userId,
                                            },
                                        },
                                    },
                                },
                                include: exports.conversationPopulated,
                            })];
                    case 2:
                        conversations = _a.sent();
                        return [2 /*return*/, conversations];
                    case 3:
                        error_1 = _a.sent();
                        console.log('conversation error: ', error_1);
                        throw new graphql_1.GraphQLError(error_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
    Mutation: {
        createConversation: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, res, pubSub, participantIds, _a, code, payload, conversation, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prisma = context.prisma, res = context.res, pubSub = context.pubSub;
                        participantIds = args.participantIds;
                        _a = res === null || res === void 0 ? void 0 : res.locals.tokenPayload, code = _a.code, payload = _a.payload;
                        console.log('here is pubSub in createConversation', pubSub);
                        if (code !== 200) {
                            throw new graphql_1.GraphQLError('You are not authorized to perform this action.', {
                                extensions: {
                                    code: code,
                                },
                            });
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.conversation.create({
                                data: {
                                    participants: {
                                        createMany: {
                                            data: participantIds.map(function (id) { return ({
                                                userId: id,
                                                hasSeenLatestMassage: id === payload.userId,
                                            }); }),
                                        },
                                    },
                                },
                                include: exports.conversationPopulated,
                            })];
                    case 2:
                        conversation = _b.sent();
                        pubSub === null || pubSub === void 0 ? void 0 : pubSub.publish('CONVERSATION_CREATED', {
                            conversationCreated: conversation,
                        });
                        return [2 /*return*/, { conversationId: conversation.id }];
                    case 3:
                        error_2 = _b.sent();
                        console.log(error_2);
                        throw new graphql_1.GraphQLError('Create conversation has encountered an error: ', error_2);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        markConversationAsRead: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, tokenPayload, conversationId, reqUserId, code, status, payload, userId, participant, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, tokenPayload = context.tokenPayload;
                        conversationId = args.conversationId, reqUserId = args.userId;
                        code = tokenPayload.code, status = tokenPayload.status, payload = tokenPayload.payload;
                        if (code !== 200)
                            throw new graphql_1.GraphQLError('Not authorized to perform this action');
                        userId = payload === null || payload === void 0 ? void 0 : payload.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, prisma.conversationParticipant.findFirst({
                                where: {
                                    conversationId: conversationId,
                                    userId: userId,
                                },
                            })];
                    case 2:
                        participant = _a.sent();
                        //always exist but being safe is no harm
                        if (!participant)
                            throw new graphql_1.GraphQLError('error in marking conversation as read function: participant find error');
                        return [4 /*yield*/, prisma.conversationParticipant.update({
                                where: {
                                    id: participant.id,
                                },
                                data: {
                                    hasSeenLatestMassage: true,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        error_3 = _a.sent();
                        console.log('markConversationAsRead:', error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                        throw new graphql_1.GraphQLError('error in marking conversation as read function');
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        deleteConversation: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, pubSub, tokenPayload, conversationId, code, payload, deletedConversation, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, pubSub = context.pubSub, tokenPayload = context.tokenPayload;
                        conversationId = args.conversationId;
                        code = tokenPayload.code, payload = tokenPayload.payload;
                        if (code !== 200) {
                            throw new graphql_1.GraphQLError('You are not authorized to perform this action.', {
                                extensions: {
                                    code: code,
                                },
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        //delete conversation and all its entities with prisma transaction
                        // const [deletedConversation] = await prisma.$transaction([
                        //   prisma.conversation.delete({
                        //     where: {
                        //       id: conversationId,
                        //     },
                        //     include: conversationPopulated,
                        //   }),
                        //   prisma.conversationParticipant.deleteMany({
                        //     where: {
                        //       conversationId,
                        //     },
                        //   }),
                        //   prisma.message.deleteMany({
                        //     where: {
                        //       conversationId,
                        //     },
                        //   }),
                        // ]);
                        return [4 /*yield*/, prisma.conversationParticipant.deleteMany({
                                where: {
                                    conversationId: conversationId,
                                },
                            })];
                    case 2:
                        //delete conversation and all its entities with prisma transaction
                        // const [deletedConversation] = await prisma.$transaction([
                        //   prisma.conversation.delete({
                        //     where: {
                        //       id: conversationId,
                        //     },
                        //     include: conversationPopulated,
                        //   }),
                        //   prisma.conversationParticipant.deleteMany({
                        //     where: {
                        //       conversationId,
                        //     },
                        //   }),
                        //   prisma.message.deleteMany({
                        //     where: {
                        //       conversationId,
                        //     },
                        //   }),
                        // ]);
                        _a.sent();
                        console.log('conversationParticipant deleted');
                        return [4 /*yield*/, prisma.conversation.delete({
                                where: {
                                    id: conversationId,
                                },
                                include: exports.conversationPopulated,
                            })];
                    case 3:
                        deletedConversation = _a.sent();
                        console.log('Conversation deleted');
                        return [4 /*yield*/, prisma.message.deleteMany({
                                where: {
                                    conversationId: conversationId,
                                },
                            })];
                    case 4:
                        _a.sent();
                        console.log('message deleted');
                        pubSub.publish('CONVERSATION_DELETE', {
                            conversationDeleted: deletedConversation,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.log('delete conversation failed:', error_4);
                        throw new graphql_1.GraphQLError('delete conversation failed');
                    case 6: return [2 /*return*/, true];
                }
            });
        }); },
    },
    Subscription: {
        conversationCreated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (_, __, context) {
                var pubSub = context.pubSub;
                return pubSub.asyncIterator(['CONVERSATION_CREATED']);
            }, function (payload, _variables, context) {
                var tokenPayload = context.tokenPayload;
                if (tokenPayload.code !== 200) {
                    throw new graphql_1.GraphQLError('Not authorized: ' + tokenPayload.status);
                }
                var userId = tokenPayload.payload.userId;
                var participants = payload.conversationCreated.participants;
                return (0, functions_1.userIsConversationParticipant)(participants, userId);
            }),
        },
        conversationUpdated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (_, __, context) {
                var pubSub = context.pubSub;
                return pubSub.asyncIterator(['CONVERSATION_UPDATED']);
            }, function (payload, _variables, context) {
                var tokenPayload = context.tokenPayload;
                if (tokenPayload.code !== 200) {
                    throw new graphql_1.GraphQLError('Not authorized: ' + tokenPayload.status);
                }
                var userId = tokenPayload.payload.userId;
                var participants = payload.conversationUpdated.participants;
                return (0, functions_1.userIsConversationParticipant)(participants, userId);
            }),
        },
        conversationDeleted: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (_, __, context) {
                var pubSub = context.pubSub;
                return pubSub.asyncIterator(['CONVERSATION_DELETE']);
            }, function (payload, _variables, context) {
                var tokenPayload = context.tokenPayload;
                if (tokenPayload.code !== 200) {
                    throw new graphql_1.GraphQLError('Not authorized: ' + tokenPayload.status);
                }
                var userId = tokenPayload.payload.userId;
                var participants = payload.conversationDeleted.participants;
                return (0, functions_1.userIsConversationParticipant)(participants, userId);
            }),
        },
    },
};
exports.participantPopulated = client_1.Prisma.validator()({
    user: {
        select: {
            id: true,
            username: true,
        },
    },
});
exports.conversationPopulated = client_1.Prisma.validator()({
    participants: {
        include: exports.participantPopulated,
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    },
});
exports.default = resolvers;
