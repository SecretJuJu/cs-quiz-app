import request from 'supertest';
import app from '../app';

describe('App', () => {
  it('should return welcome message on root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('CS 퀴즈 앱 API에 오신 것을 환영합니다');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
}); 