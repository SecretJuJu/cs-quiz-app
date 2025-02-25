export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-based index of the correct option
  difficulty: Difficulty;
  points: number;
}

export interface User {
  nickname: string;
  createdAt: string;
}

export interface QuizResult {
  id: string;
  nickname: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
  totalTimeInSeconds: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
} 