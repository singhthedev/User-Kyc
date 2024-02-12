"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.jwtSecretKey || 'thisisSecrete';
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'You are not authenticated' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (typeof decodedToken !== 'object' || decodedToken === null) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Token verification error:');
        res.status(403).json({ message: 'Token verification error', error });
        return;
    }
};
exports.verifyToken = verifyToken;
