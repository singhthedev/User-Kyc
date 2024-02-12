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
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.jwtSecretKey || '';
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const existingUser = yield user_1.default.findOne({ userName });
        if (existingUser) {
            res.status(400).json({ message: 'userName already exists' });
            return;
        }
        const existingUserEmail = yield user_1.default.findOne({ email });
        if (existingUserEmail) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({
            userName,
            email,
            password: hashedPassword,
        });
        yield user.save();
        res.status(201).json({ message: 'User created successfully', user });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
        return;
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, }, jwtSecret, { expiresIn: '1h' });
        let userData = { token: token };
        res.status(200).json({ message: 'Login successfully', userData });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
        return;
    }
});
exports.login = login;
