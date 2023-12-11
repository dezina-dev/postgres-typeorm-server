import { createConnection } from 'typeorm';
import express from 'express';
import userRouter from './routes/user.route';

const app = express();
const port = 5000;

createConnection()
  .then(async (connection) => {
    // Run schema synchronization manually
    await connection.synchronize();

    app.use(express.json());
    app.use('/user', userRouter);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));
