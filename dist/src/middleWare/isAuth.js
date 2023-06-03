"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthSubscription = exports.isAuthMiddleWare = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var isAuthMiddleWare = function (req, res, next) {
    try {
        var authorization = req.headers['authorization'];
        if (!authorization)
            throw new Error('no token provided');
        var token = authorization.split(' ')[1];
        var payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET);
        res.locals.tokenPayload = {
            payload: payload,
            status: 'token successfully verified',
            code: 200,
        };
    }
    catch (error) {
        res.locals.tokenPayload = {
            payload: null,
            status: error.message,
            code: 401,
        };
    }
    return next();
};
exports.isAuthMiddleWare = isAuthMiddleWare;
var isAuthSubscription = function (accessToken) {
    try {
        if (!accessToken)
            throw new Error('no token provided');
        var payload = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
        return {
            payload: payload,
            status: 'token successfully verified',
            code: 200,
        };
    }
    catch (error) {
        return {
            payload: null,
            status: error.message,
            code: 401,
        };
    }
};
exports.isAuthSubscription = isAuthSubscription;
