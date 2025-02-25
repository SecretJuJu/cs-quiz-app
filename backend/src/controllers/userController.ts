import { Request, Response } from 'express';
import { createUser, getUserByNickname, getAllUsers } from '../models/userModel';

export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nickname } = req.body;

    if (!nickname) {
      res.status(400).json({ error: '닉네임은 필수입니다.' });
      return;
    }

    // 이미 존재하는 닉네임인지 확인
    const existingUser = await getUserByNickname(nickname);
    if (existingUser) {
      res.status(200).json(existingUser); // 이미 존재하면 해당 사용자 정보 반환
      return;
    }

    const user = await createUser(nickname);
    res.status(201).json(user);
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    res.status(500).json({ error: '사용자를 생성하는 중 오류가 발생했습니다.' });
  }
};

export const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nickname } = req.params;
    const user = await getUserByNickname(nickname);

    if (!user) {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    res.status(500).json({ error: '사용자를 조회하는 중 오류가 발생했습니다.' });
  }
};

export const getAllUsersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('모든 사용자 조회 오류:', error);
    res.status(500).json({ error: '사용자 목록을 조회하는 중 오류가 발생했습니다.' });
  }
}; 