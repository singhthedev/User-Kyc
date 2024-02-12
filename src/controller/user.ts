import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.jwtSecretKey || 'thisisprivate';


export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, email, password } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

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


export const login = async (req: Request, res: Response): Promise<void> => {
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