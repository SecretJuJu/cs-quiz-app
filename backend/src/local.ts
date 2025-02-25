import app from './app';
import { seedQuestions } from './models/questionModel';

const PORT = process.env.PORT || 3001;

// 서버 시작 시 문제 데이터 시드
const initializeData = async () => {
  try {
    await seedQuestions();
    console.log('문제 데이터가 초기화되었습니다.');
  } catch (error) {
    console.error('문제 데이터 초기화 오류:', error);
  }
};

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  await initializeData();
}); 