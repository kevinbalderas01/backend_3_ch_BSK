import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import errorHandler from "./middlewares/error.js"
import mocksRouter from "./routes/mocks.router.js"
import { swaggeroptions } from './utils/swagger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cors from 'cors';


dotenv.config()
const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(process.env.MONGO_URL)
const specs = swaggerJsdoc(swaggeroptions);

app.use(cors())

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);



app.use(errorHandler)
app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
