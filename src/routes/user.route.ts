import { Router } from 'express';

import UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/create-user', UserController.registerUser);
userRouter.get('/get-users', UserController.getUserList);
userRouter.post('/create-order/:userId', UserController.createOrder);
userRouter.get('/get-user-orders/:userId', UserController.getUserList);

export default userRouter;
