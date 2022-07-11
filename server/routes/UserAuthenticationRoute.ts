import express, { Request, Response, Router } from 'express';
import userModel from '../models/UserModel';
import bodyParser from 'body-parser';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router: Router = express.Router();
const jsonParser = bodyParser.json();

interface IUserModel {
  _id: string;
  username: string;
  email: string;
  password: string;
}

router.post('/register', jsonParser, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: 'ok' });
  } catch (e) {
    //TODO User valdidator
    res.json({
      status: 'error',
      error: 'Something went wrong when trying to create User',
    });
  }
});
router.post('/login', jsonParser, async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET
      );
      const cookie = req.cookies.token;
      if (cookie == undefined) {
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 168, //7 days,
        });
      }
      return res.status(200).json({ message: 'login success' });
    } else {
      return res.status(400).json({ error: 'User not found' });
    }
  } catch (e) {
    //TODO User valdidator
    res.json({
      status: 'error',
      error: 'Something went wrong when trying to sign in User',
    });
  }
});

router.get('/logout', jsonParser, async (req: Request, res: Response) => {
  console.log('logout');
  res.cookie('token', '', { maxAge: 1 });
  res.status(200).json({ message: 'logout success' });
});

router.get('/isAuth', jsonParser, async (req: Request, res: Response) => {
  const request_token = req.cookies.token;
  var auth: boolean = false;
  //If Request token is not set
  if (!request_token) {
    return res.status(400).json({ error: 'Please login' });
  }
  try {
    //Verify token
    if (!jwt.verify(request_token, process.env.JWT_SECRET)) {
      return res.status(400).json({ error: 'Token is not valid' });
    } else {
      auth = true;
    }
  } catch (err) {
    console.log(err);
  }
  //If Token is valid
  if (auth) {
    const data = jwt.verify(
      request_token,
      process.env.JWT_SECRET
    ) as IUserModel;
    userModel.findById(data._id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'User not found' });
      }
      //If user is found
      const { _id, username, email } = user;
      return res.status(200).json({ user: { _id, username, email } });
    });
  }
});
export default router;
