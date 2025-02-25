import { Router } from 'express';
import { 
  submitQuizHandler, 
  getResultByIdHandler, 
  getResultsByNicknameHandler,
  getLeaderboardHandler
} from '../controllers/resultController';

const router = Router();

// 퀴즈 결과 제출
router.post('/', submitQuizHandler);

// 특정 결과 조회
router.get('/:id', getResultByIdHandler);

// 사용자별 결과 조회
router.get('/user/:nickname', getResultsByNicknameHandler);

// 리더보드 조회
router.get('/leaderboard/top', getLeaderboardHandler);

export default router; 