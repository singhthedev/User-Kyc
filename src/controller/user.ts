import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import dotenv from 'dotenv';
import { emailValidate, passwordRegex } from '../utils/helper';
dotenv.config();

const jwtSecret = process.env.jwtSecretKey || 'thisisprivate';


// Post request for creating a new user
export const signup = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    const fieldRequired = ['email', 'userName', 'password']
    const missingField = fieldRequired.filter(field => !req.body[field]);
    if (missingField.length > 0) {
      const missingFieldMessage = missingField.join(', ');
      res.status(400).json({ message: `${missingFieldMessage} field is required` })
      return;
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      res.status(400).json({ message: 'userName already exists' });
      return;
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    if (!emailValidate(email)) {
      res.status(400).json({
        message: "Invalid email format",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must contain at least one Upper letter, one digit, one special character (!@#$%^&*()_+)",
      });
      return;
    }

    const user: IUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
    return;
  } catch (error) {
    console.error('Error creating user');
    res.status(500).json({ message: 'Error creating user', error });
    return;
  }
};


// Post request for logged in user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id, email: user.email, }, jwtSecret, { expiresIn: '1h' });

    let userData = { token: token };

    res.status(200).json({ message: 'Login successfully', userData });
    return;
  } catch (error) {
    console.error('Error in login');
    res.status(500).json({ message: 'Error in login', error });
    return;
  }
};


// Get request for finding the authenticated user
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;

    const getUser = await User.findOne({ _id: user })
    if (!getUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const foundedUser = {
      userName: getUser.userName,
      email: getUser.email,
    }
    
    res.status(200).json({ message: 'User retrieved successfully', foundedUser });
  } catch (error) {
    console.error('Error in get User details');
    res.status(500).json({ message: 'Error in get User details', error });
    return;
  }
}