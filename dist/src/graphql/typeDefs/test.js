"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = __importDefault(require("graphql-tag"));
var typeDefs = (0, graphql_tag_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Query {\n    test(a: String!): testResponse\n  }\n\n  type testResponse {\n    success: Boolean\n    error: String\n  }\n\n  # type Subscription{}\n"], ["\n  type Query {\n    test(a: String!): testResponse\n  }\n\n  type testResponse {\n    success: Boolean\n    error: String\n  }\n\n  # type Subscription{}\n"])));
exports.default = typeDefs;
var templateObject_1;
