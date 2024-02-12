"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = require("../middleware/authToken");
const user_1 = require("../controller/user");
const appSecrete_1 = require("../controller/appSecrete");
const router = express_1.default.Router();
router.post('/signup', user_1.signup);
router.post('/login', user_1.login);
router.post('/appSecret', authToken_1.verifyToken, appSecrete_1.AppSecreteAndKey);
exports.default = router;
