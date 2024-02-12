import { Request, Response } from 'express';
import AppSecrete, { IAppSecrete } from '../model/appSecrete';



const apiKeyLength: number = 32; 
const secretKeyLength: number = 32;

const generateRandomString = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
};

export const AppSecreteAndKey = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    
    const { callbackURL, redirectURL } = req.body;

    const apiKey = generateRandomString(apiKeyLength);
    const secretKey = generateRandomString(secretKeyLength);

    const appKey: IAppSecrete = new AppSecrete({
      userID: user,
      apiKey,
      secretKey,
      callbackURL,
      redirectURL
    });

    await appKey.save();

    res.status(201).json({ message: 'Key created successfully', appKey });
    return;
  } catch (error) {
    console.error('Error in creating AppSecrete');
    res.status(500).json({ message: 'Error in creating AppSecrete', error });
    return;
  }
};

