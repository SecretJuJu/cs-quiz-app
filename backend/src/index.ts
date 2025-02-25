import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app';

// AWS Lambda 핸들러
export const handler: APIGatewayProxyHandler = serverless(app); 