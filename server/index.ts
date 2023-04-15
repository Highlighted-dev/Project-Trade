import mongoose from 'mongoose';
import app from './app';
import schedulePriceUpdate from './ScheduledTasks';

const url = 'mongodb+srv://root:root@project-trade.d28vx.mongodb.net/project-trade';
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
