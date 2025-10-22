import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import traderRoutes from './routes/traderRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import customerCreditsRoutes from './routes/customerCreditsRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit);

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Cache-Control', 'public, max-age=31557600'); 
    }
  }
}));


app.use('/api/auth', authRoutes);
app.use("/api/traders", traderRoutes);
app.use("/api/categories", productCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/customer-credits', customerCreditsRoutes);


app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});