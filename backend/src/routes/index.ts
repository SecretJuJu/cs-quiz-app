import { Router } from 'express';
import userRoutes from './userRoutes';
import questionRoutes from './questionRoutes';
import resultRoutes from './resultRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/results', resultRoutes);

export default router; 