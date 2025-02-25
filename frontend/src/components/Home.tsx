import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Grid
} from '@mui/material';
import { createUser } from '../services/api';

const Home: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createUser(nickname);
      // 로컬 스토리지에 닉네임 저장
      localStorage.setItem('nickname', nickname);
      navigate('/quiz');
    } catch (err) {
      console.error('사용자 생성 오류:', err);
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            CS 퀴즈 앱
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            컴퓨터 과학 지식을 테스트하고 다른 사용자들과 경쟁해보세요!
          </Typography>
          
          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="닉네임"
              variant="outlined"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  퀴즈 시작하기
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleViewLeaderboard}
                  sx={{ py: 1.5 }}
                >
                  리더보드 보기
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 