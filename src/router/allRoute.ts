import express from 'express';
import { verifyToken } from '../middleware/authToken';
import { signup, login, getUser } from '../controller/user';
import { AppSecreteAndKey, getAppSecrete, updateAppSecrete, deleteAppSecrete } from '../controller/appSecrete';



const router = express.Router();


// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', verifyToken, getUser);



// App Secrete routes
router.post('/appSecret', verifyToken, AppSecreteAndKey)
router.get('/appSecret', verifyToken, getAppSecrete)
router.patch('/appSecret', verifyToken, updateAppSecrete)
router.delete('/appSecret', verifyToken, deleteAppSecrete)

export default router;
