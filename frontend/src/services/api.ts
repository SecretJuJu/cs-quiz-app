import axios from 'axios';
import { User, Question, QuizResult, Answer } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 사용자 API
export const createUser = async (nickname: string): Promise<User> => {
  const response = await api.post('/users', { nickname });
  return response.data;
};

export const getUser = async (nickname: string): Promise<User> => {
  const response = await api.get(`/users/${nickname}`);
  return response.data;
};

// 문제 API
export const getQuizQuestions = async (): Promise<Question[]> => {
  const response = await api.get('/questions/quiz/random');
  return response.data;
};

// 결과 API
export const submitQuiz = async (
  nickname: string,
  answers: Answer[],
  startTime: string
): Promise<QuizResult> => {
  const response = await api.post('/results', {
    nickname,
    answers,
    startTime,
  });
  return response.data;
};

export const getLeaderboard = async (limit: number = 10): Promise<QuizResult[]> => {
  const response = await api.get(`/results/leaderboard/top?limit=${limit}`);
  return response.data;
};

export const getUserResults = async (nickname: string): Promise<QuizResult[]> => {
  const response = await api.get(`/results/user/${nickname}`);
  return response.data;
}; 