import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit);

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});