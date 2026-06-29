const request = require('supertest');
const app = require('../src/server');

describe('Developer Persona: API Bug', () => {
    it('should successfully fetch dev data without crashing', async () => {
        const res = await request(app).get('/api/dev-data');
        
        // This expects a 200, but the server will throw a 500 TypeError
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('theme');
    });
});
