"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("./user"));
var conversation_1 = __importDefault(require("./conversation"));
var test_1 = __importDefault(require("./test"));
var message_1 = __importDefault(require("./message"));
var typeDefs = [user_1.default, conversation_1.default, test_1.default, message_1.default];
exports.default = typeDefs;
