import express from 'express';
import mongoose from 'mongoose';

const app = express();
const url = 'mongodb://127.0.0.1:27017';

mongoose.connect(url)

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected: ',url)
})
db.on('error',err => {
    console.log('Connection falied: ',err)
})
