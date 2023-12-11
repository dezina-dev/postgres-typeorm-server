import { Router } from 'express';

import UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/create-user', UserController.registerUser);
userRouter.get('/get-users', UserController.getUserList);

export default userRouter;
