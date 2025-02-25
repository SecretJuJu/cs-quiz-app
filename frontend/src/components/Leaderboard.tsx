import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip
} from '@mui/material';
import { getLeaderboard } from '../services/api';
import { QuizResult } from '../types';

const Leaderboard: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard(20); // 상위 20명 가져오기
        setResults(leaderboardData);
        setIsLoading(false);
      } catch (err) {
        console.error('리더보드 로딩 오류:', err);
        setError('리더보드를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  const handleStartQuiz = () => {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
      navigate('/quiz');
    } else {
      navigate('/');
    }
  };
  
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5">리더보드를 불러오는 중...</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleReturnHome}
            sx={{ mt: 2 }}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            리더보드
          </Typography>
          
          {results.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                아직 퀴즈 결과가 없습니다.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                첫 번째로 퀴즈를 풀어보세요!
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>순위</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>닉네임</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>점수</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>정답 수</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>소요 시간</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, index) => {
                    // 현재 사용자 강조 표시
                    const isCurrentUser = result.nickname === localStorage.getItem('nickname');
                    
                    return (
                      <TableRow 
                        key={result.id}
                        sx={{ 
                          bgcolor: isCurrentUser ? '#e3f2fd' : 'inherit',
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <TableCell align="center">
                          {index === 0 ? (
                            <Chip label="1" color="primary" size="small" />
                          ) : index === 1 ? (
                            <Chip label="2" color="secondary" size="small" />
                          ) : index === 2 ? (
                            <Chip label="3" color="warning" size="small" />
                          ) : (
                            index + 1
                          )}
                        </TableCell>
                        <TableCell>
                          {isCurrentUser ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ fontWeight: 'bold' }}>{result.nickname}</Typography>
                              <Chip label="나" size="small" sx={{ ml: 1 }} />
                            </Box>
                          ) : (
                            result.nickname
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{result.score}</TableCell>
                        <TableCell align="center">{result.correctAnswers}/{result.totalQuestions}</TableCell>
                        <TableCell align="center">{formatTime(result.totalTimeInSeconds)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleReturnHome}
            >
              홈으로
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartQuiz}
            >
              퀴즈 시작하기
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Leaderboard; 