import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDb, TableNames } from './dynamodb';
import { QuizResult } from './types';

export const createResult = async (
  nickname: string,
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  startTime: string,
  endTime: string,
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[]
): Promise<QuizResult> => {
  const id = uuidv4();
  const totalTimeInSeconds = Math.floor(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
  );

  const result: QuizResult = {
    id,
    nickname,
    score,
    correctAnswers,
    totalQuestions,
    startTime,
    endTime,
    totalTimeInSeconds,
    answers,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: TableNames.RESULTS,
      Item: result,
    })
  );

  return result;
};

export const getResultById = async (id: string): Promise<QuizResult | null> => {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: TableNames.RESULTS,
      Key: { id },
    })
  );

  return result.Item as QuizResult || null;
};

export const getResultsByNickname = async (nickname: string): Promise<QuizResult[]> => {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: TableNames.RESULTS,
      IndexName: 'NicknameIndex',
      KeyConditionExpression: 'nickname = :nickname',
      ExpressionAttributeValues: {
        ':nickname': nickname,
      },
    })
  );

  return (result.Items || []) as QuizResult[];
};

export const getTopResults = async (limit: number = 10): Promise<QuizResult[]> => {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: TableNames.RESULTS,
      IndexName: 'ScoreIndex',
      KeyConditionExpression: 'score >= :minScore',
      ExpressionAttributeValues: {
        ':minScore': 0,
      },
      ScanIndexForward: false, // 내림차순 정렬
      Limit: limit,
    })
  );

  // 점수가 같은 경우 소요 시간으로 정렬
  const sortedResults = (result.Items || []) as QuizResult[];
  sortedResults.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score; // 점수 내림차순
    }
    return a.totalTimeInSeconds - b.totalTimeInSeconds; // 시간 오름차순
  });

  return sortedResults.slice(0, limit);
}; 