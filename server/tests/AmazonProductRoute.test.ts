import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

describe('GET /api/ap/', () => {
  test('should return all products', async () => {
    const res = await request(app).get('/api/ap/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(100);
    expect(res.body[0]).toMatchObject({
      product_id: expect.any(String),
      product_name: expect.any(String),
      product_sale_price: expect.any(String),
      product_image: expect.any(String),
    });
  });
});

describe('GET /api/ap/id', () => {
  test('should return all product ids', async () => {
    const res = await request(app).get('/api/ap/id/');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.every((id: unknown) => typeof id === 'string')).toBe(true);
  });
});

describe('GET /api/ap/array', () => {
  test('returns the correct products for valid input', async () => {
    const response = await request(app)
      .get('/api/ap/array')
      .query({ array: ['B07YGZQ4DM', 'B073JYVKNX'] });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        product_id: 'B07YGZQ4DM',
        product_name: 'Kingston Canvas Select Plus SD - SDS2/128GB Class 10 UHS-I',
        product_sale_price: '17.79',
        product_image: 'https://m.media-amazon.com/images/I/71W86phD-3L._AC_UL320_.jpg',
      }),
    );
    expect(response.body[1]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        product_id: 'B073JYVKNX',
        product_name:
          'SanDisk Ultra 64GB (SDSQUAR-064G-GN6MA) microSDXC Memory Card + Adapter up to 100 MB / s, Class 10, U1, A1, Gray, Red',
        product_sale_price: '15.54',
        product_image: 'https://m.media-amazon.com/images/I/7180ZAZmERL._AC_UL320_.jpg',
      }),
    );
  });

  test('returns 400 error for missing array parameter', async () => {
    const response = await request(app).get('/api/ap/array');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Missing array parameter',
    });
  });
});

describe('GET /name/:name', () => {
  it('should return an array of matching product data', async () => {
    const name = 'iPhone';
    const response = await request(app).get(`/api/ap/name/${name}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((item: any) => {
      expect(item.product_name.toLowerCase()).toContain(name.toLowerCase());
    });
  });

  it('should return an empty array when there are no matches', async () => {
    const name = 'xyz';
    const response = await request(app).get(`/api/ap/name/${name}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('GET /api/ap/id/*', () => {
  test('should return basic product informations from "Amazon Product Column" in db', async () => {
    const res = await request(app).get('/api/ap/id/B073JYVKNX');
    expect(res.statusCode).toBe(200);

    const response_data = res.body.data[0];
    expect(response_data.product_id).toBe('B073JYVKNX');
    expect(response_data.product_name).toBe(
      'SanDisk Ultra 64GB (SDSQUAR-064G-GN6MA) microSDXC Memory Card + Adapter up to 100 MB / s, Class 10, U1, A1, Gray, Red',
    );
    expect(response_data.product_sale_price).toBe('15.54');
    expect(response_data.product_image).toBe(
      'https://m.media-amazon.com/images/I/7180ZAZmERL._AC_UL320_.jpg',
    );
  });

  test('should return 404 error when product id is not found', async () => {
    const res = await request(app).get('/api/ap/id/123');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      message: 'Couldnt find the data',
    });
  });
});

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://root:root@project-trade.d28vx.mongodb.net/project-trade');
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
});
