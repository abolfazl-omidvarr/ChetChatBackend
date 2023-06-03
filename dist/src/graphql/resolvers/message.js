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
exports.messagePopulated = void 0;
var client_1 = require("@prisma/client");
var graphql_1 = require("graphql");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var functions_1 = require("../../util/functions");
var conversation_1 = require("./conversation");
var resolvers = {
    Query: {
        messages: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, tokenPayload, payload, status, code, conversationId, userId, conversation, allowedToView, messages, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, tokenPayload = context.tokenPayload;
                        payload = tokenPayload.payload, status = tokenPayload.status, code = tokenPayload.code;
                        conversationId = args.conversationId;
                        userId = payload === null || payload === void 0 ? void 0 : payload.userId;
                        console.log(tokenPayload);
                        /**
                         * authentication check
                         */
                        if (code !== 200 && !payload)
                            throw new graphql_1.GraphQLError('Not Authorized:' + status);
                        return [4 /*yield*/, prisma.conversation.findUnique({
                                where: { id: conversationId },
                                include: conversation_1.conversationPopulated,
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation)
                            throw new graphql_1.GraphQLError('conversation not found');
                        allowedToView = (0, functions_1.userIsConversationParticipant)(conversation.participants, userId);
                        if (!allowedToView)
                            throw new graphql_1.GraphQLError('Not Authorized to do this action');
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, prisma.message.findMany({
                                where: {
                                    conversationId: conversationId,
                                },
                                include: exports.messagePopulated,
                                orderBy: {
                                    createdAt: 'desc',
                                },
                            })];
                    case 3:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                    case 4:
                        error_1 = _a.sent();
                        console.log('messages error: ', error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                        throw new graphql_1.GraphQLError('messages error: ' + (error_1 === null || error_1 === void 0 ? void 0 : error_1.message));
                    case 5: return [2 /*return*/];
                }
            });
        }); },
    },
    Mutation: {
        sendMessage: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var pubSub, tokenPayload, prisma, body, conversationId, messageId, senderId, code, payload, status, userId, newMessageObj, conversationObj, newMessage, participant, conversation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pubSub = context.pubSub, tokenPayload = context.tokenPayload, prisma = context.prisma;
                        body = args.body, conversationId = args.conversationId, messageId = args.id, senderId = args.senderId;
                        code = tokenPayload.code, payload = tokenPayload.payload, status = tokenPayload.status;
                        userId = payload === null || payload === void 0 ? void 0 : payload.userId;
                        //authorization check & check if senderId is math with current user Id
                        if (code !== 200 || userId !== senderId)
                            throw new graphql_1.GraphQLError('Not Authorized:' + status);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, prisma.message.create({
                                data: {
                                    id: messageId,
                                    body: body,
                                    conversationId: conversationId,
                                    senderId: senderId,
                                },
                                include: exports.messagePopulated,
                            })];
                    case 2:
                        newMessage = _a.sent();
                        return [4 /*yield*/, prisma.conversationParticipant.findFirst({
                                where: {
                                    conversationId: conversationId,
                                    userId: userId,
                                },
                            })];
                    case 3:
                        participant = _a.sent();
                        if (!participant)
                            throw new graphql_1.GraphQLError('sending message went wrong: find participant error');
                        return [4 /*yield*/, prisma.conversation.update({
                                where: {
                                    id: conversationId,
                                },
                                data: {
                                    latestMessageId: newMessage.id,
                                    participants: {
                                        update: {
                                            where: {
                                                id: participant.id,
                                            },
                                            data: {
                                                hasSeenLatestMassage: true,
                                            },
                                        },
                                        updateMany: {
                                            where: {
                                                NOT: {
                                                    userId: senderId,
                                                },
                                            },
                                            data: {
                                                hasSeenLatestMassage: false,
                                            },
                                        },
                                    },
                                },
                                include: conversation_1.conversationPopulated,
                            })];
                    case 4:
                        conversation = _a.sent();
                        pubSub.publish('MESSAGE_SENT', { messageSent: newMessage });
                        pubSub.publish('CONVERSATION_UPDATED', {
                            conversationUpdated: conversation,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log('send message error: ', error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                        throw new graphql_1.GraphQLError('send message error: ' + (error_2 === null || error_2 === void 0 ? void 0 : error_2.message));
                    case 6: return [2 /*return*/, true];
                }
            });
        }); },
    },
    Subscription: {
        messageSent: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (parent, _args, context) {
                var pubSub = context.pubSub;
                return pubSub.asyncIterator(['MESSAGE_SENT']);
            }, function (payload, args, context) {
                return payload.messageSent.conversationId === args.conversationId;
            }),
        },
    },
};
exports.messagePopulated = client_1.Prisma.validator()({
    sender: {
        select: {
            id: true,
            username: true,
        },
    },
});
exports.default = resolvers;
