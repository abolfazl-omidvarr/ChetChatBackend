"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var server_1 = require("@apollo/server");
var drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
var http_1 = require("http");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var ws_1 = require("ws");
var ws_2 = require("graphql-ws/lib/use/ws");
var schema_1 = require("@graphql-tools/schema");
var express4_1 = require("@apollo/server/express4");
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var dotenv = __importStar(require("dotenv"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
var prisma_1 = __importDefault(require("../prisma/prisma"));
var isAuth_1 = require("./middleWare/isAuth");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var querystring_1 = __importDefault(require("querystring"));
var functions_1 = require("./util/functions");
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function makeId(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            var counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }
        var pubSub, app, httpServer, schema, corsOption, wsServer, getSubscriptionContext, serverCleanup, server, getGoogleOAuthTokens, findAccount, createAccount;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pubSub = new graphql_subscriptions_1.PubSub();
                    app = (0, express_1.default)();
                    httpServer = (0, http_1.createServer)(app);
                    schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
                    corsOption = {
                        origin: process.env.CLIENT_ORIGIN,
                        credentials: true,
                    };
                    wsServer = new ws_1.WebSocketServer({
                        server: httpServer,
                        path: '/graphql/subscriptions',
                    });
                    getSubscriptionContext = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                        var accessToken, tokenPayload;
                        return __generator(this, function (_a) {
                            ctx;
                            // ctx is the graphql-ws Context where connectionParams live
                            if (ctx.connectionParams && ctx.connectionParams.accessToken) {
                                accessToken = ctx.connectionParams.accessToken;
                                tokenPayload = (0, isAuth_1.isAuthSubscription)(accessToken);
                                return [2 /*return*/, {
                                        prisma: prisma_1.default,
                                        pubSub: pubSub,
                                        tokenPayload: tokenPayload,
                                        req: null,
                                        res: null,
                                    }];
                            }
                            // Otherwise let our resolvers know we don't have a current user
                            return [2 /*return*/, {
                                    prisma: prisma_1.default,
                                    pubSub: pubSub,
                                    tokenPayload: { code: 403, payload: null, status: 'Not authorized' },
                                    req: null,
                                    res: null,
                                }];
                        });
                    }); };
                    serverCleanup = (0, ws_2.useServer)({
                        schema: schema,
                        context: function (ctx) {
                            // This will be run every time the client sends a subscription request
                            // Returning an object will add that information to our
                            // GraphQL context, which all of the resolvers have access to.
                            return getSubscriptionContext(ctx);
                        },
                    }, wsServer);
                    server = new server_1.ApolloServer({
                        schema: schema,
                        introspection: true,
                        csrfPrevention: true,
                        cache: 'bounded',
                        plugins: [
                            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer: httpServer }),
                            {
                                serverWillStart: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, {
                                                    drainServer: function () {
                                                        return __awaiter(this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, serverCleanup.dispose()];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        });
                                                    },
                                                }];
                                        });
                                    });
                                },
                            },
                        ],
                    });
                    return [4 /*yield*/, server.start()];
                case 1:
                    _a.sent();
                    app.use('/', (0, cookie_parser_1.default)());
                    app.use('/graphql', (0, cookie_parser_1.default)(), (0, cors_1.default)(corsOption), body_parser_1.default.json(), isAuth_1.isAuthMiddleWare, (0, express4_1.expressMiddleware)(server, {
                        context: function (_a) {
                            var req = _a.req, res = _a.res;
                            return __awaiter(_this, void 0, void 0, function () {
                                var tokenPayload;
                                return __generator(this, function (_b) {
                                    tokenPayload = res.locals.tokenPayload;
                                    return [2 /*return*/, { req: req, res: res, prisma: prisma_1.default, tokenPayload: tokenPayload, pubSub: pubSub }];
                                });
                            });
                        },
                    }));
                    app.use('/refresh_token', (0, cors_1.default)(corsOption));
                    app.post('/refresh_token', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var token, payload, user, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    token = req.cookies.jid;
                                    if (!token) {
                                        return [2 /*return*/, res.send({ ok: false, accessToken: '' })];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_SECRET);
                                    return [4 /*yield*/, prisma_1.default.user.findUnique({
                                            where: {
                                                id: payload.userId,
                                            },
                                        })];
                                case 2:
                                    user = _a.sent();
                                    if (!user) {
                                        return [2 /*return*/, res.send({ ok: false, accessToken: '' })];
                                    }
                                    if (user.tokenVersion !== payload.tokenVersion) {
                                        return [2 /*return*/, res.send({ ok: false, accessToken: '' })];
                                    }
                                    (0, functions_1.sendRefreshToken)(res, (0, functions_1.createRefreshToken)(user));
                                    return [2 /*return*/, res.send({
                                            ok: true,
                                            accessToken: (0, functions_1.createAccessToken)(user),
                                            userId: payload.userId,
                                        })];
                                case 3:
                                    error_1 = _a.sent();
                                    console.log(error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.use('/keepAlive', (0, cors_1.default)(corsOption));
                    app.get('/keepAlive', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log('server is up and running');
                            return [2 /*return*/, res.send({ ok: true, msg: 'server is up and running' })];
                        });
                    }); });
                    app.use('/google-oAuth', (0, cors_1.default)(corsOption));
                    app.get('/google-oAuth', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var code, _a, id_token, access_token, googleUser, foundUser, createdUser, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    code = req.query.code;
                                    return [4 /*yield*/, getGoogleOAuthTokens({ code: code })];
                                case 1:
                                    _a = _b.sent(), id_token = _a.id_token, access_token = _a.access_token;
                                    googleUser = jsonwebtoken_1.default.decode(id_token);
                                    return [4 /*yield*/, findAccount(googleUser)];
                                case 2:
                                    foundUser = _b.sent();
                                    if (foundUser) {
                                        (0, functions_1.sendRefreshToken)(res, (0, functions_1.createRefreshToken)(foundUser));
                                        res.redirect('http://localhost:3000');
                                    }
                                    if (!!foundUser) return [3 /*break*/, 4];
                                    return [4 /*yield*/, createAccount(googleUser)];
                                case 3:
                                    createdUser = _b.sent();
                                    (0, functions_1.sendRefreshToken)(res, (0, functions_1.createRefreshToken)(createdUser));
                                    res.redirect('http://localhost:3000');
                                    _b.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_2 = _b.sent();
                                    console.log(error_2);
                                    console.log(error_2.message);
                                    res.redirect('http://localhost:3000');
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    getGoogleOAuthTokens = function (_a) {
                        var code = _a.code;
                        return __awaiter(_this, void 0, void 0, function () {
                            var url, values, googleUser, error_3;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        url = 'https://oauth2.googleapis.com/token';
                                        values = {
                                            code: code,
                                            client_id: process.env.GOOGLE_CLIENT_ID,
                                            client_secret: process.env.GOOGLE_CLIENT_SECRET,
                                            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
                                            grant_type: 'authorization_code',
                                        };
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, fetch(url, {
                                                method: 'POST',
                                                body: querystring_1.default.stringify(values),
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                },
                                            }).then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, res.json()];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); })];
                                    case 2:
                                        googleUser = _b.sent();
                                        return [2 /*return*/, googleUser];
                                    case 3:
                                        error_3 = _b.sent();
                                        console.error(error_3);
                                        console.log('failed to fetch google oath tokens:' + error_3.message);
                                        throw new Error(error_3.message);
                                    case 4: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    findAccount = function (googleUser) { return __awaiter(_this, void 0, void 0, function () {
                        var foundUser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma_1.default.user.findUnique({
                                        where: { email: googleUser.email },
                                    })];
                                case 1:
                                    foundUser = _a.sent();
                                    return [2 /*return*/, foundUser];
                            }
                        });
                    }); };
                    createAccount = function (googleUser) { return __awaiter(_this, void 0, void 0, function () {
                        var picture, email, email_verified, name, given_name, createdUser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    picture = googleUser.picture, email = googleUser.email, email_verified = googleUser.email_verified, name = googleUser.name, given_name = googleUser.given_name;
                                    return [4 /*yield*/, prisma_1.default.user.create({
                                            data: {
                                                email: email,
                                                emailVerified: email_verified,
                                                image: picture,
                                                name: name,
                                                username: "".concat(given_name).concat(makeId(5)),
                                            },
                                        })];
                                case 1:
                                    createdUser = _a.sent();
                                    return [2 /*return*/, createdUser];
                            }
                        });
                    }); };
                    httpServer.listen(4000, function () {
                        console.log('🚀 Server listening at port 4000');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) { return console.log('server runs error:', err); });
