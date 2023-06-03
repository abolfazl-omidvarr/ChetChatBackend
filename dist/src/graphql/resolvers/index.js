"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("./user"));
var conversation_1 = __importDefault(require("./conversation"));
var message_1 = __importDefault(require("./message"));
var test_1 = __importDefault(require("./test"));
var lodash_merge_1 = __importDefault(require("lodash.merge"));
var resolvers = (0, lodash_merge_1.default)({}, user_1.default, conversation_1.default, message_1.default, test_1.default);
exports.default = resolvers;
