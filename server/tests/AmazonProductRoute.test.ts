import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

describe('GET product data from database', () => {
  it('should return product informations', async () => {
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
});

beforeEach(async () => {
  await mongoose.connect('mongodb+srv://root:root@project-trade.d28vx.mongodb.net/project-trade');
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});
