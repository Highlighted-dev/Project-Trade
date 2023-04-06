import express, { Application } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import AmazonProductRoute from './routes/AmazonProductRoute';
import AmazonScraperRoute from './routes/AmazonScraperRoute';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import UserFavouritesRoute from './routes/UserFavouritesRoute';
import AmazonSalesRoute from './routes/AmazonSalesRoute';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const app: Application = express();

// as=amazonScraper

app.use(helmet());
app.use(cookieParser());
app.use(
  session({
    secret: 'amazonsecret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
); // TODO Change secret key
app.use('/api/ap', AmazonProductRoute);
app.use('/api/as', AmazonScraperRoute);
app.use('/api/sales', AmazonSalesRoute);
app.use('/api/auth', UserAuthenticationRoute);
app.use('/api/favourites', UserFavouritesRoute);

export default app;
