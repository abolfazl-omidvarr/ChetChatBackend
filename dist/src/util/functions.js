"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsConversationParticipant = exports.sendRefreshToken = exports.createRefreshToken = exports.createAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var createAccessToken = function (user) {
    return jsonwebtoken_1.default.sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expiresIn: '15m',
    });
};
exports.createAccessToken = createAccessToken;
var createRefreshToken = function (user) {
    return jsonwebtoken_1.default.sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_SECRET, {
        expiresIn: '7d',
    });
};
exports.createRefreshToken = createRefreshToken;
var sendRefreshToken = function (res, token) {
    res.cookie('jid', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
};
exports.sendRefreshToken = sendRefreshToken;
var userIsConversationParticipant = function (participants, userId) { return participants.some(function (participant) { return participant.userId === userId; }); };
exports.userIsConversationParticipant = userIsConversationParticipant;
