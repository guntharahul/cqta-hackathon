const request = require('supertest');
const app = require('../src/server');

describe('User Registration API', () => {
    it('should register a new user successfully', async () => {
        const payload = {
            username: 'testuser123',
            email: 'testuser123@example.com',
            age: 25 // Auto-healed: added missing required 'age' field
            // Missing 'age' field which causes the test to fail
        };

        const res = await request(app)
            .post('/api/users')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toEqual(payload.username);
    });
});
