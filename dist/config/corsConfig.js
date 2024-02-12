"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCorsOptions = void 0;
const cors_1 = __importDefault(require("cors"));
const configCorsOptions = ({} = {}) => {
    const options = {
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        credentials: true
    };
    return (0, cors_1.default)(options);
};
exports.configCorsOptions = configCorsOptions;
