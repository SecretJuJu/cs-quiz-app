import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api', routes);

// 기본 라우트
app.get('/', (_req, res) => {
  res.json({ message: 'CS 퀴즈 앱 API에 오신 것을 환영합니다!' });
});

// 404 처리
app.use((_req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// 오류 처리
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

export default app; 