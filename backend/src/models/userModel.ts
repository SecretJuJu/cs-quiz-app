import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TableNames } from './dynamodb';
import { User } from './types';

export const createUser = async (nickname: string): Promise<User> => {
  const now = new Date().toISOString();
  const user: User = {
    nickname,
    createdAt: now,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: TableNames.USERS,
      Item: user,
      ConditionExpression: 'attribute_not_exists(nickname)',
    })
  );

  return user;
};

export const getUserByNickname = async (nickname: string): Promise<User | null> => {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: TableNames.USERS,
      Key: { nickname },
    })
  );

  return result.Item as User || null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: TableNames.USERS,
    })
  );

  return (result.Items || []) as User[];
}; 