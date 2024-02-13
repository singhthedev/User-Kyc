import express from 'express';
import { verifyToken } from '../middleware/authToken';
import { signUp, login, getUser, CreateAppSecreteAndKey, regenerateKeys, updateAppSecrete, deleteAppSecrete } from '../controller/user';



const router = express.Router();


// Auth routes
router.post('/signup', signUp);
router.post('/login', login);
router.get('/user', verifyToken, getUser);
router.post('/user', verifyToken, CreateAppSecreteAndKey)
router.put('/user/:projectId/:projectName', verifyToken, regenerateKeys);
router.patch('/user/:projectId/:projectName', verifyToken, updateAppSecrete);
router.delete('/user/:projectId/:projectName', verifyToken, deleteAppSecrete);


export default router;
