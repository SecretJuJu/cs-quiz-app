import { Router } from 'express';
import { createUserHandler, getUserHandler, getAllUsersHandler } from '../controllers/userController';

const router = Router();

// 사용자 생성
router.post('/', createUserHandler);

// 특정 사용자 조회
router.get('/:nickname', getUserHandler);

// 모든 사용자 조회
router.get('/', getAllUsersHandler);

export default router; 