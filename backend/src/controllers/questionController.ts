import { Request, Response } from 'express';
import { 
  getAllQuestions, 
  getQuestionById, 
  getRandomQuestions, 
  seedQuestions 
} from '../models/questionModel';

export const getAllQuestionsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const questions = await getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    console.error('모든 문제 조회 오류:', error);
    res.status(500).json({ error: '문제 목록을 조회하는 중 오류가 발생했습니다.' });
  }
};

export const getQuestionByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await getQuestionById(id);

    if (!question) {
      res.status(404).json({ error: '문제를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(question);
  } catch (error) {
    console.error('문제 조회 오류:', error);
    res.status(500).json({ error: '문제를 조회하는 중 오류가 발생했습니다.' });
  }
};

export const getQuizQuestionsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    // 기본값: 쉬움 4문제, 중간 3문제, 어려움 3문제
    const questions = await getRandomQuestions(4, 3, 3);
    
    // 클라이언트에게 보낼 때는 정답을 제외한 문제 정보만 전송
    const sanitizedQuestions = questions.map(({ correctAnswer, ...rest }) => ({
      ...rest,
    }));

    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    console.error('퀴즈 문제 조회 오류:', error);
    res.status(500).json({ error: '퀴즈 문제를 조회하는 중 오류가 발생했습니다.' });
  }
};

export const seedQuestionsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    await seedQuestions();
    res.status(200).json({ message: '문제가 성공적으로 추가되었습니다.' });
  } catch (error) {
    console.error('문제 시드 오류:', error);
    res.status(500).json({ error: '문제를 추가하는 중 오류가 발생했습니다.' });
  }
}; 