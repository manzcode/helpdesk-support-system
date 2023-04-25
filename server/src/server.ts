import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.FRONT_END,
    }),
);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
