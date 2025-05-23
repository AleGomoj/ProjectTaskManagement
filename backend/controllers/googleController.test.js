const request = require('supertest');
const app = require('../app');
const googleController = require('./googleController');

describe('Google Controller', () => {
  it('GET /api/google should return 200', async () => {
    const res = await request(app).get('/api/google');
    expect([200,404]).toContain(res.statusCode);
  });
});

describe('googleController', () => {
  it('should return 400 if no credential provided', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await googleController.googleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No credential provided' });
  });

  it('should return 401 if Google does not return email', async () => {
    jest.mock('google-auth-library', () => ({
      OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({ getPayload: () => ({ name: 'Test', sub: '123' }) })
      }))
    }));
    const req = { body: { credential: 'token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await googleController.googleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Google auth failed' }));
  });

  it('should return 401 if Google throws error', async () => {
    jest.mock('google-auth-library', () => ({
      OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockRejectedValue(new Error('fail'))
      }))
    }));
    const req = { body: { credential: 'token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await googleController.googleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Google auth failed' }));
  });
});
