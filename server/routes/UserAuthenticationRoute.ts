import express, { Request, Response, Router } from 'express';
import userModel from '../models/UserModel';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
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

const doesPasswordHaveCapitalLetter = (password: string) => {
  //Check if there is any uppercase letter in password. If there is not, return error
  if (/[A-Z]/.test(password)) return true;
  return false;
};

const doesPasswordHaveNumber = (password: string) => {
  //Check if there is any number in password. If there is not, return error
  if (/[1-9]/.test(password)) return true;
  return false;
};

const isEmailValid = (email: string) => {
  //Regular Expression validating email with rfc822 standard. If email is not valid, return error. Examples:
  // asdkladlkaslkaslk  /Not valid
  // test.com  /Not valid
  // test@test  /Not valid
  // test@test.com   /Valid
  if (
    /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
      email
    )
  )
    return true;
  return false;
};

router.post('/register', jsonParser, async (req: Request, res: Response) => {
  // Checks if any value is null. Validates password and email. If password is not valid, return error. If email is not valid, return error.
  if (
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.birthdate &&
    req.body.sex &&
    doesPasswordHaveCapitalLetter(req.body.password) &&
    doesPasswordHaveNumber(req.body.password) &&
    isEmailValid(req.body.email)
  ) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        birthdate: req.body.birthdate,
        sex: req.body.sex,
        role: 'User',
      });
      res.json({ status: 'ok' });
    } catch (e) {
      //TODO User valdidator
      res.json({
        status: 'error',
        message: 'Something went wrong when trying to create User',
      });
    }
  } else {
    return res.status(400).json({
      status: 'error',
      error: 'BAD REQUEST',
      message:
        'Request values cannot be null. Password must contain at least one number and one uppercase letter and email must be valid(by rfc822 standard)',
    });
  }
});

router.post('/login', jsonParser, async (req: Request, res: Response) => {
  try {
    //Try to find user by email
    const user = await userModel.findOne({
      email: req.body.email,
    });

    if (user) {
      //bcrypt compares function compares password with hashed password in database. If password is not valid, return error.
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user!.password
      );

      //If password is valid and user is found, return token.
      if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const cookie = req.cookies.token;
        //If cookie is already set, return error. If cookie is not set, set cookie.
        if (cookie == undefined) {
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 168, //7 days,
          });
          return res.status(200).json({
            status: 'ok',
            message: 'login success',
            isUserLoggedIn: true,
          });
        }
        return res
          .status(400)
          .json({ status: 'error', message: 'You are already logged in' });
      }
      //If password is not valid, return error.
      return res
        .status(400)
        .json({ status: 'error', message: 'Password is not valid' });
    }
    //If user is not found, return error.
    return res
      .status(400)
      .json({ status: 'error', message: 'Email is not valid' });
  } catch (e) {
    res.status(400).json({
      status: 'error',
      error: 'BAD REQUEST',
      message: 'Something went wrong when trying to sign in User',
    });
  }
});

// logout user by deleting cookie.
router.get('/logout', jsonParser, async (req: Request, res: Response) => {
  res.cookie('token', '', { maxAge: 1 });
  res.status(200).json({ status: 'ok', message: 'logout success' });
});

router.get(
  '/isAuthenticated',
  jsonParser,
  async (req: Request, res: Response) => {
    const request_token = req.cookies.token;
    var auth: boolean = false;
    //If Request token is not set
    if (!request_token) {
      //We want to return status code 200, becouse it just means user did not login yet, it is not an error.
      return res.status(200).json({
        status: 'ok',
        message: 'User is not logged in.',
        isUserLoggedIn: false,
      });
    }
    try {
      //Verify token
      if (!jwt.verify(request_token, process.env.JWT_SECRET)) {
        return res.status(400).json({
          status: 'error',
          error: 'BAD REQUEST',
          message: 'Token is not valid',
        });
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
          return res.status(400).json({
            status: 'error',
            error: 'BAD REQUEST',
            message: 'User not found',
          });
        }
        //If user is found
        const { _id, username, email } = user;
        return res.status(200).json({ user: { _id, username, email } });
      });
    }
  }
);
export default router;
