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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSecreteAndKey = void 0;
const appSecrete_1 = __importDefault(require("../model/appSecrete"));
const apiKeyLength = 32;
const secretKeyLength = 32;
const generateRandomString = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
};
const AppSecreteAndKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { callbackURL } = req.body;
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'You are not authenticated!', success: false });
        }
        const userId = user.userId;
        const apiKey = generateRandomString(apiKeyLength);
        const secretKey = generateRandomString(secretKeyLength);
        const appKey = new appSecrete_1.default({
            userID: userId,
            apiKey,
            secretKey,
            callbackURL
        });
        yield appKey.save();
        res.status(201).json({ message: 'Key created successfully', appKey });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.AppSecreteAndKey = AppSecreteAndKey;
