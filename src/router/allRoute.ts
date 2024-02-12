import express from 'express';
import { signup, login } from '../controller/user';
import { AppSecreteAndKey } from '../controller/appSecrete';
import { verifyToken } from '../middleware/authToken';



const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);


router.post('/appSecret', verifyToken, AppSecreteAndKey)

export default router;
