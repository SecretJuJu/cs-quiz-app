import { Request, Response } from 'express';
import { createResult, getResultById, getResultsByNickname, getTopResults } from '../models/resultModel';
import { getQuestionById } from '../models/questionModel';

export const submitQuizHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      nickname, 
      answers, 
      startTime 
    } = req.body;

    if (!nickname || !answers || !Array.isArray(answers) || !startTime) {
      res.status(400).json({ error: '닉네임, 답변 목록, 시작 시간은 필수입니다.' });
      return;
    }

    const endTime = new Date().toISOString();
    let totalScore = 0;
    let correctAnswersCount = 0;
    const processedAnswers = [];

    // 각 답변 처리
    for (const answer of answers) {
      const { questionId, selectedOption } = answer;
      const question = await getQuestionById(questionId);

      if (!question) {
        continue; // 문제를 찾을 수 없는 경우 건너뜀
      }

      const isCorrect = selectedOption === question.correctAnswer;
      if (isCorrect) {
        totalScore += question.points;
        correctAnswersCount++;
      }

      processedAnswers.push({
        questionId,
        selectedOption,
        isCorrect,
      });
    }

    const result = await createResult(
      nickname,
      totalScore,
      correctAnswersCount,
      answers.length,
      startTime,
      endTime,
      processedAnswers
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('퀴즈 제출 오류:', error);
    res.status(500).json({ error: '퀴즈 결과를 저장하는 중 오류가 발생했습니다.' });
  }
};

export const getResultByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getResultById(id);

    if (!result) {
      res.status(404).json({ error: '결과를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('결과 조회 오류:', error);
    res.status(500).json({ error: '결과를 조회하는 중 오류가 발생했습니다.' });
  }
};

export const getResultsByNicknameHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nickname } = req.params;
    const results = await getResultsByNickname(nickname);
    res.status(200).json(results);
  } catch (error) {
    console.error('사용자 결과 조회 오류:', error);
    res.status(500).json({ error: '사용자 결과를 조회하는 중 오류가 발생했습니다.' });
  }
};

export const getLeaderboardHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const results = await getTopResults(limit);
    res.status(200).json(results);
  } catch (error) {
    console.error('리더보드 조회 오류:', error);
    res.status(500).json({ error: '리더보드를 조회하는 중 오류가 발생했습니다.' });
  }
}; 