import express, { Application, Response, Request } from 'express';
import mongoose, { Connection } from 'mongoose';
import amazonProductDataRoute from './routes/amazonProductDataRoute'
const app: Application = express(); 
//as=amazonScraper



const url: string = 'mongodb://localhost:27017/ProjectTrade';
const port: number = 5000

mongoose.connect(url).then(() => app.listen(port, () => console.log('Database connected: ',url,' | Its alive on http://localhost:'+port))).catch((error) => console.log(error.message))

app.use('/api',amazonProductDataRoute)