const request = require('supertest');
const app = require('../src/server');

describe('QA Persona: Schema Mismatch', () => {
    it('should register a new user successfully', async () => {
        const payload = {
            username: 'qa-tester',
            email: 'qa@example.com'
            // AI will auto-heal by adding 'age: 25' here
        };

        const res = await request(app)
            .post('/api/users')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });
});
