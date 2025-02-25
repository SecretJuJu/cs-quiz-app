import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

export const TableNames = {
  USERS: `cs-quiz-app-backend-users-${process.env.NODE_ENV || 'dev'}`,
  QUESTIONS: `cs-quiz-app-backend-questions-${process.env.NODE_ENV || 'dev'}`,
  RESULTS: `cs-quiz-app-backend-results-${process.env.NODE_ENV || 'dev'}`,
}; 