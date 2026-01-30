import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Health check
router.use('/', healthRoutes);

// Future routes
// router.use('/api/auth', authRoutes);
// router.use('/api/users', usersRoutes);
// router.use('/api/products', productsRoutes);
// router.use('/api/orders', ordersRoutes);

export default router;
