import express, { Application, Response, Request } from 'express';
import mongoose, { Connection } from 'mongoose';

const app: Application = express();
app.get('/', (req: Request, res: Response ) =>{
    res.json({message: "json_file"})   
});


const url: string = 'mongodb://127.0.0.1:27017';
const port: number = 5000

mongoose.connect(url).then(() => app.listen(port, () => console.log('Database connected: ',url))).catch((error) => console.log(error.message))

const db: Connection = mongoose.connection
