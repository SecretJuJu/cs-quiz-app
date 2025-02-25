import { PutCommand, GetCommand, ScanCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDb, TableNames } from './dynamodb';
import { Question, Difficulty } from './types';

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const id = uuidv4();
  const newQuestion: Question = {
    id,
    ...question,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: TableNames.QUESTIONS,
      Item: newQuestion,
    })
  );

  return newQuestion;
};

export const getQuestionById = async (id: string): Promise<Question | null> => {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: TableNames.QUESTIONS,
      Key: { id },
    })
  );

  return result.Item as Question || null;
};

export const getAllQuestions = async (): Promise<Question[]> => {
  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: TableNames.QUESTIONS,
    })
  );

  return (result.Items || []) as Question[];
};

export const getRandomQuestions = async (
  easyCount: number = 4,
  mediumCount: number = 3,
  hardCount: number = 3
): Promise<Question[]> => {
  const allQuestions = await getAllQuestions();
  
  const easyQuestions = allQuestions.filter(q => q.difficulty === Difficulty.EASY);
  const mediumQuestions = allQuestions.filter(q => q.difficulty === Difficulty.MEDIUM);
  const hardQuestions = allQuestions.filter(q => q.difficulty === Difficulty.HARD);
  
  const getRandomSubset = (arr: Question[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const selectedEasy = getRandomSubset(easyQuestions, easyCount);
  const selectedMedium = getRandomSubset(mediumQuestions, mediumCount);
  const selectedHard = getRandomSubset(hardQuestions, hardCount);
  
  return [...selectedEasy, ...selectedMedium, ...selectedHard];
};

export const seedQuestions = async (): Promise<void> => {
  const questions: Omit<Question, 'id'>[] = [
    // EASY questions
    {
      text: '운영체제에서 프로세스와 스레드의 주요 차이점은 무엇인가요?',
      options: [
        '프로세스는 독립적인 메모리 공간을 가지고, 스레드는 프로세스 내에서 메모리를 공유한다',
        '스레드는 독립적인 메모리 공간을 가지고, 프로세스는 스레드 내에서 메모리를 공유한다',
        '프로세스와 스레드는 동일한 개념이다',
        '프로세스는 하드웨어를 관리하고, 스레드는 소프트웨어를 관리한다'
      ],
      correctAnswer: 0,
      difficulty: Difficulty.EASY,
      points: 10
    },
    {
      text: 'HTTP 상태 코드 404는 무엇을 의미하나요?',
      options: [
        '서버 내부 오류',
        '요청 성공',
        '리다이렉션',
        '리소스를 찾을 수 없음'
      ],
      correctAnswer: 3,
      difficulty: Difficulty.EASY,
      points: 10
    },
    {
      text: '다음 중 객체 지향 프로그래밍의 주요 특징이 아닌 것은?',
      options: [
        '캡슐화',
        '상속',
        '다형성',
        '순차적 실행'
      ],
      correctAnswer: 3,
      difficulty: Difficulty.EASY,
      points: 10
    },
    {
      text: '데이터베이스에서 SQL은 무엇의 약자인가요?',
      options: [
        'Structured Query Language',
        'Simple Question Language',
        'System Quality Level',
        'Standard Query Logic'
      ],
      correctAnswer: 0,
      difficulty: Difficulty.EASY,
      points: 10
    },
    {
      text: '다음 중 정렬 알고리즘의 평균 시간 복잡도가 O(n log n)인 것은?',
      options: [
        '버블 정렬',
        '삽입 정렬',
        '퀵 정렬',
        '선택 정렬'
      ],
      correctAnswer: 2,
      difficulty: Difficulty.EASY,
      points: 10
    },
    
    // MEDIUM questions
    {
      text: '다음 중 비대칭 암호화 알고리즘은?',
      options: [
        'AES',
        'DES',
        'RSA',
        'Blowfish'
      ],
      correctAnswer: 2,
      difficulty: Difficulty.MEDIUM,
      points: 20
    },
    {
      text: '가상 메모리의 주요 목적은 무엇인가요?',
      options: [
        '프로세서 속도 향상',
        '물리적 메모리보다 큰 주소 공간 제공',
        '하드 디스크 공간 절약',
        '네트워크 대역폭 최적화'
      ],
      correctAnswer: 1,
      difficulty: Difficulty.MEDIUM,
      points: 20
    },
    {
      text: 'TCP와 UDP의 주요 차이점은 무엇인가요?',
      options: [
        'TCP는 연결 지향적이고 신뢰성이 있으며, UDP는 비연결형이고 신뢰성이 없다',
        'TCP는 비연결형이고 신뢰성이 없으며, UDP는 연결 지향적이고 신뢰성이 있다',
        'TCP는 데이터그램 기반이고, UDP는 스트림 기반이다',
        'TCP는 암호화를 지원하고, UDP는 암호화를 지원하지 않는다'
      ],
      correctAnswer: 0,
      difficulty: Difficulty.MEDIUM,
      points: 20
    },
    {
      text: '다음 중 데이터베이스 트랜잭션의 ACID 속성에 해당하지 않는 것은?',
      options: [
        'Atomicity (원자성)',
        'Consistency (일관성)',
        'Isolation (격리성)',
        'Distributivity (분산성)'
      ],
      correctAnswer: 3,
      difficulty: Difficulty.MEDIUM,
      points: 20
    },
    
    // HARD questions
    {
      text: '다음 중 P vs NP 문제에 대한 설명으로 옳은 것은?',
      options: [
        'P = NP임이 증명되었다',
        'P ≠ NP임이 증명되었다',
        'P가 NP의 부분집합인지 여부는 아직 미해결 문제이다',
        'P와 NP는 완전히 다른 개념이다'
      ],
      correctAnswer: 2,
      difficulty: Difficulty.HARD,
      points: 30
    },
    {
      text: '분산 시스템에서 CAP 정리에 따르면 동시에 보장할 수 없는 세 가지 속성은?',
      options: [
        'Consistency, Availability, Partition Tolerance',
        'Concurrency, Atomicity, Performance',
        'Correctness, Accuracy, Precision',
        'Caching, Authentication, Privacy'
      ],
      correctAnswer: 0,
      difficulty: Difficulty.HARD,
      points: 30
    },
    {
      text: '다음 중 최악의 경우 시간 복잡도가 O(2^n)인 알고리즘은?',
      options: [
        '이진 검색',
        '퀵 정렬',
        '재귀적 피보나치 수열 계산',
        '힙 정렬'
      ],
      correctAnswer: 2,
      difficulty: Difficulty.HARD,
      points: 30
    },
    {
      text: '양자 컴퓨팅에서 큐비트(Qubit)의 특성으로 옳은 것은?',
      options: [
        '항상 0 또는 1의 값만 가진다',
        '0과 1의 중첩 상태를 가질 수 있다',
        '최대 4개의 상태를 동시에 표현할 수 있다',
        '양자 컴퓨터에서는 사용되지 않는 개념이다'
      ],
      correctAnswer: 1,
      difficulty: Difficulty.HARD,
      points: 30
    }
  ];

  // 기존 문제가 있는지 확인
  const existingQuestions = await getAllQuestions();
  if (existingQuestions.length > 0) {
    console.log('Questions already exist in the database');
    return;
  }

  // 문제 생성
  const questionPromises = questions.map(q => createQuestion(q));
  await Promise.all(questionPromises);
  console.log(`${questions.length} questions have been seeded`);
}; 