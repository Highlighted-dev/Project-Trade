import express, { Application } from 'express';
import mongoose from 'mongoose';
import AmazonProductRoute from './routes/AmazonProductRoute';
import AmazonScraperRoute from './routes/AmazonScraperRoute';
import session from 'express-session';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import UserFavouritesRoute from './routes/UserFavouritesRoute';
import schedulePriceUpdate from './ScheduledTasks';
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app: Application = express();

//as=amazonScraper

const url: string = process.env.MONGODB_URI!;
const port: number = 5000;

mongoose
  .connect(url)
  .then(() =>
    app.listen(port, () =>
      console.log(
        'Database connected:',
        url,
        '| Server working on http://localhost:' + port
      )
    )
  )
  .catch(error => console.log(error.message));

app.use(cookieParser());
app.use(
  session({
    secret: 'amazonsecret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
); //TODO Change secret key
app.use('/api/ap', AmazonProductRoute);
app.use('/api/as', AmazonScraperRoute);
app.use('/api/auth', UserAuthenticationRoute);
app.use('/api/favourites', UserFavouritesRoute);

schedulePriceUpdate;
