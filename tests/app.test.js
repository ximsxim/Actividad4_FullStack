const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
describe('Pruebas MtyCoffeeGuide', () => {
    
    // PRUEBA EXITOSA 
    test('GET /api/cafeterias debe responder con 200', async () => {
        const res = await request(app).get('/api/cafeterias');
        expect(res.statusCode).toBe(200);
    });

    // PRUEBA EXITOSA
    test('POST /api/cafeterias debe dar error 400 si falta el nombre', async () => {
        const tokenAdmin = jwt.sign({ id: 1, rol: 'admin' }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
        
        const res = await request(app)
            .post('/api/cafeterias')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ direccion: 'San Pedro', especialidad: 'Espresso' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('El nombre es requerido');
    });

    // PRUEBA INTENCIONALMENTE ERRÓNEA
    test('PRUEBA FALLIDA: Intenta crear cafetería sin nombre esperando éxito  (200)', async () => {
        const tokenAdmin = jwt.sign({ id: 1, rol: 'admin' }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
        
        const res = await request(app)
            .post('/api/cafeterias')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ direccion: 'Monterrey' });

        expect(res.statusCode).toBe(200); 
    });

    afterAll((done) => {
        db.end();
        done();
    });
});