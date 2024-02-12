import express from 'express';
import { verifyToken } from '../middleware/authToken';
import { signUp, login, getUser, CreateAppSecreteAndKey } from '../controller/user';



const router = express.Router();


// Auth routes
router.post('/signup', signUp);
router.post('/login', login);
router.get('/user', verifyToken, getUser);
router.post('/user', verifyToken, CreateAppSecreteAndKey)


export default router;
