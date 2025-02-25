import { Router } from 'express';
import { 
  getAllQuestionsHandler, 
  getQuestionByIdHandler, 
  getQuizQuestionsHandler,
  seedQuestionsHandler
} from '../controllers/questionController';

const router = Router();

// 모든 문제 조회
router.get('/', getAllQuestionsHandler);

// 특정 문제 조회
router.get('/:id', getQuestionByIdHandler);

// 퀴즈용 랜덤 문제 조회
router.get('/quiz/random', getQuizQuestionsHandler);

// 문제 시드 데이터 추가
router.post('/seed', seedQuestionsHandler);

export default router; 