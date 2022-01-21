import express, { Application, Response, Request } from 'express';
import mongoose, { Connection } from 'mongoose';
import amazonScraperRoutes from './routes/amazonScraper';

const app: Application = express(); 

//as=amazonScraper
app.use('/as', amazonScraperRoutes);

const url: string = 'mongodb://127.0.0.1:27017';
const port: number = 5000

mongoose.connect(url).then(() => app.listen(port, () => console.log('Database connected: ',url,' | Its alive on http://localhost:'+port))).catch((error) => console.log(error.message))

const db: Connection = mongoose.connection
