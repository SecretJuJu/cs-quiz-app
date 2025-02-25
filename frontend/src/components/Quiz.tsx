import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl,
  LinearProgress,
  Chip
} from '@mui/material';
import { getQuizQuestions, submitQuiz } from '../services/api';
import { Question, Answer, Difficulty } from '../types';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState('');
  const [timeLeft, setTimeLeft] = useState(15); // 15초 타이머
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  // 닉네임 가져오기
  const nickname = localStorage.getItem('nickname');
  
  useEffect(() => {
    // 닉네임이 없으면 홈으로 리다이렉트
    if (!nickname) {
      navigate('/');
      return;
    }
    
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuizQuestions();
        setQuestions(fetchedQuestions);
        setStartTime(new Date().toISOString());
        setIsLoading(false);
      } catch (err) {
        console.error('문제 로딩 오류:', err);
        setError('문제를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [navigate, nickname]);
  
  // 타이머 설정
  useEffect(() => {
    if (isLoading || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 15;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading, currentQuestionIndex, questions]);
  
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(event.target.value, 10));
  };
  
  const handleNextQuestion = () => {
    // 현재 답변 저장
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedOption: selectedOption !== null ? selectedOption : -1, // -1은 선택하지 않음을 의미
      };
      
      setAnswers([...answers, newAnswer]);
    }
    
    // 다음 문제로 이동 또는 퀴즈 제출
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(15);
    } else {
      handleSubmitQuiz();
    }
  };
  
  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 마지막 문제의 답변이 answers에 추가되지 않았을 수 있으므로 확인
      let finalAnswers = [...answers];
      if (finalAnswers.length < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        const lastAnswer: Answer = {
          questionId: currentQuestion.id,
          selectedOption: selectedOption !== null ? selectedOption : -1,
        };
        finalAnswers.push(lastAnswer);
      }
      
      const result = await submitQuiz(nickname!, finalAnswers, startTime);
      navigate('/result', { state: { result } });
    } catch (err) {
      console.error('퀴즈 제출 오류:', err);
      setError('퀴즈 결과를 제출하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5">문제를 불러오는 중...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
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
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (questions.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5">문제가 없습니다.</Typography>
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
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // 난이도에 따른 색상
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'success';
      case Difficulty.MEDIUM:
        return 'warning';
      case Difficulty.HARD:
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              문제 {currentQuestionIndex + 1}/{questions.length}
            </Typography>
            <Chip 
              label={`${currentQuestion.difficulty} (${currentQuestion.points}점)`}
              color={getDifficultyColor(currentQuestion.difficulty) as any}
            />
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={(timeLeft / 15) * 100} 
            sx={{ mb: 3, height: 10, borderRadius: 5 }}
          />
          
          <Typography variant="h5" gutterBottom>
            {currentQuestion.text}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              남은 시간: {timeLeft}초
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
              disabled={isSubmitting}
            >
              {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '제출하기'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Quiz; 