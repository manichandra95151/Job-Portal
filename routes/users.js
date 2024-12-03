import express from 'express';
import UserController from '../controllers/userController.js';
import { auth } from '../middlewares/loginAuthenticator.js';

const router = express.Router();
const userController = new UserController();

// User routes
router.get('/', userController.getHomePage);
router.get('/register', userController.RecruiterRegistration);
router.post('/register', userController.addUser);
router.get('/login', userController.login);
router.post('/login', userController.LoginAuthenticator);
router.get('/logout', userController.logout);
router.get('/dashboard', auth, userController.renderRecruiterDashboard);

export default router;
