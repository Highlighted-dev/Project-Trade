import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import schedulePriceUpdate from './ScheduledTasks';

dotenv.config();

const url = process.env.MONGODB_URI || '';
const port = 5000;

mongoose
  .connect(url)
  .then(() =>
    app.listen(port, () =>
      console.log('Database connected:', url, `| Server working on http://localhost:${port}`),
    ),
  )
  .catch(error => console.log(error.message));

app.use(() => schedulePriceUpdate);
