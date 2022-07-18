import express, { Application, Response, Request } from 'express';
import mongoose, { Connection } from 'mongoose';
import AmazonProductRoute from './routes/AmazonProductRoute';
import AmazonScraperRoute from './routes/AmazonScraperRoute';
import session from 'express-session';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import UserFavouritesRoute from './routes/UserFavouritesRoute';
const cookieParser = require('cookie-parser');
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
