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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var graphql_1 = require("graphql");
var functions_1 = require("../../util/functions");
var resolvers = {
    Query: {
        searchUsers: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var searchedUsername, prisma, res, _a, code, userId, foundUsersByUsername, foundUsersByEmail, foundUser, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchedUsername = args.username;
                        prisma = context.prisma, res = context.res;
                        _a = res === null || res === void 0 ? void 0 : res.locals.tokenPayload, code = _a.code, userId = _a.payload.userId;
                        if (code !== 200) {
                            throw new graphql_1.GraphQLError('You are not authorized to perform this action.', {
                                extensions: {
                                    code: code,
                                },
                            });
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, prisma.user.findMany({
                                where: {
                                    id: {
                                        not: userId,
                                    },
                                    username: {
                                        contains: searchedUsername,
                                        mode: 'insensitive',
                                    },
                                },
                            })];
                    case 2:
                        foundUsersByUsername = _b.sent();
                        return [4 /*yield*/, prisma.user.findMany({
                                where: {
                                    id: {
                                        not: userId,
                                    },
                                    email: {
                                        equals: searchedUsername,
                                        mode: 'insensitive',
                                    },
                                },
                            })];
                    case 3:
                        foundUsersByEmail = _b.sent();
                        foundUser = foundUsersByUsername.length === 0
                            ? foundUsersByEmail
                            : foundUsersByUsername;
                        console.log(foundUser);
                        return [2 /*return*/, foundUser];
                    case 4:
                        error_1 = _b.sent();
                        throw new graphql_1.GraphQLError('something went wrong: ' + error_1);
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        loginUser: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userMail, password, prisma, req, res, tokenPayload, existingUsername, existingEmail, existedUser, isCorrectPassword, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userMail = args.userMail, password = args.password;
                        prisma = context.prisma, req = context.req, res = context.res, tokenPayload = context.tokenPayload;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    username: userMail,
                                },
                            })];
                    case 2:
                        existingUsername = _a.sent();
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    email: userMail,
                                },
                            })];
                    case 3:
                        existingEmail = _a.sent();
                        existedUser = existingUsername || existingEmail;
                        if (!existedUser) {
                            return [2 /*return*/, {
                                    error: 'Invalid Credentials',
                                }];
                        }
                        //compare found user's password with given password:
                        //if no password is in database return error(in case of OAuth2 login type)
                        if (!existedUser.hashedPassword) {
                            return [2 /*return*/, {
                                    error: 'Invalid Credentials',
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, existedUser.hashedPassword)];
                    case 4:
                        isCorrectPassword = _a.sent();
                        if (isCorrectPassword) {
                            //send refresh token as httpOnly cookie
                            (0, functions_1.sendRefreshToken)(res, (0, functions_1.createRefreshToken)(existedUser));
                            return [2 /*return*/, {
                                    success: true,
                                    accessToken: (0, functions_1.createAccessToken)(existedUser),
                                    userId: existedUser.id,
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    error: 'Invalid Credentials',
                                }];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                error: 'login failed' + error_2,
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        getCurrentUser: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, res, status, payload, user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, res = context.res;
                        status = res === null || res === void 0 ? void 0 : res.locals.tokenPayload.code;
                        payload = res === null || res === void 0 ? void 0 : res.locals.tokenPayload.payload;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (status !== 200) {
                            throw new graphql_1.GraphQLError('UNAUTHENTICATED');
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: payload.userId },
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new graphql_1.GraphQLError('Error in getting user info');
                        }
                        return [2 /*return*/, {
                                name: user.name,
                                email: user.email,
                                username: user.username,
                                image: user.image,
                            }];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
    Mutation: {
        createUsername: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var username, prisma, req, res, tokenPayload, code, userId, existingUSer, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = args.username;
                        prisma = context.prisma, req = context.req, res = context.res, tokenPayload = context.tokenPayload;
                        code = tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.code;
                        userId = (_a = tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.payload) === null || _a === void 0 ? void 0 : _a.userId;
                        if (code !== 200) {
                            throw new graphql_1.GraphQLError('access token Expired');
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    username: username,
                                },
                            })];
                    case 2:
                        existingUSer = _b.sent();
                        if (existingUSer) {
                            return [2 /*return*/, {
                                    error: 'This username is already taken',
                                }];
                        }
                        //update user
                        return [4 /*yield*/, prisma.user.update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    username: username,
                                },
                            })];
                    case 3:
                        //update user
                        _b.sent();
                        return [2 /*return*/, { success: true }];
                    case 4:
                        error_4 = _b.sent();
                        console.log('create username failed: ', error_4);
                        throw new graphql_1.GraphQLError('create username failed:' + error_4);
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        createUser: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var username, password, email, prisma, hashedPassword, existingUsername, existingEmail, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = args.username, password = args.password, email = args.email;
                        prisma = context.prisma;
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 12)];
                    case 1:
                        hashedPassword = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    username: username,
                                },
                            })];
                    case 3:
                        existingUsername = _a.sent();
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    email: email,
                                },
                            })];
                    case 4:
                        existingEmail = _a.sent();
                        if (existingUsername) {
                            return [2 /*return*/, {
                                    error: 'This username is already taken',
                                }];
                        }
                        if (existingEmail) {
                            return [2 /*return*/, {
                                    error: 'This email is already taken',
                                }];
                        }
                        //update user
                        return [4 /*yield*/, prisma.user.create({
                                data: {
                                    email: email,
                                    username: username,
                                    hashedPassword: hashedPassword,
                                },
                            })];
                    case 5:
                        //update user
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                    case 6:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [2 /*return*/, {
                                error: 'Account creation failed, maybe try different inputs',
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        }); },
        revokeRefreshToken: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, prisma, req, res, tokenPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = args.userId;
                        prisma = context.prisma, req = context.req, res = context.res, tokenPayload = context.tokenPayload;
                        return [4 /*yield*/, prisma.user.update({
                                where: { id: userId },
                                data: { tokenVersion: { increment: 1 } },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        logOut: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                req = context.req, res = context.res;
                (0, functions_1.sendRefreshToken)(res, '');
                return [2 /*return*/];
            });
        }); },
    },
    // Subscription: {},
};
exports.default = resolvers;
