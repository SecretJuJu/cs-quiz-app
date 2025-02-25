import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { QuizResult } from '../types';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state as { result: QuizResult } || {};
  
  if (!result) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">결과 정보를 찾을 수 없습니다.</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            퀴즈 결과
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">점수</Typography>
                <Typography variant="h3" color="primary">{result.score}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">정답 수</Typography>
                <Typography variant="h3" color="primary">
                  {result.correctAnswers}/{result.totalQuestions}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">소요 시간</Typography>
                <Typography variant="h3" color="primary">
                  {formatTime(result.totalTimeInSeconds)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            문제별 결과
          </Typography>
          
          <List>
            {result.answers.map((answer, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  mb: 1, 
                  bgcolor: answer.isCorrect ? '#e8f5e9' : '#ffebee',
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary={`문제 ${index + 1}`}
                  secondary={`선택한 답변: ${answer.selectedOption >= 0 ? answer.selectedOption + 1 : '선택 안함'}`}
                />
                <Chip 
                  label={answer.isCorrect ? '정답' : '오답'} 
                  color={answer.isCorrect ? 'success' : 'error'} 
                  size="small"
                />
              </ListItem>
            ))}
          </List>
          
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
              onClick={handleViewLeaderboard}
            >
              리더보드 보기
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Result; 