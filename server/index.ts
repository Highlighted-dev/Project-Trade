import express, { Application, Response, Request } from 'express';
import mongoose, { Connection } from 'mongoose';
import AmazonProductRoute from './routes/AmazonProductRoute';
import AmazonScraperRoute from './routes/AmazonScraperRoute';
const app: Application = express();
//as=amazonScraper

const url: string = 'mongodb://localhost:27017/ProjectTrade';
const port: number = 5000;

mongoose
  .connect(url)
  .then(() =>
    app.listen(port, () =>
      console.log(
        'Database connected: ',
        url,
        ' | Its alive on http://localhost:' + port
      )
    )
  )
  .catch(error => console.log(error.message));

app.use('/api/ap', AmazonProductRoute);
app.use('/api/as', AmazonScraperRoute);
