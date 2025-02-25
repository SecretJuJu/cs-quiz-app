export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  difficulty: Difficulty;
  points: number;
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: number;
}

export interface User {
  nickname: string;
  createdAt: string;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect?: boolean;
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
  answers: Answer[];
} 