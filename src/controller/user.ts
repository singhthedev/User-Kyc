import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import dotenv from 'dotenv';
import { emailValidate, generateRandomString, passwordRegex } from '../utils/helper';
dotenv.config();

const jwtSecret = process.env.jwtSecretKey || 'thisisprivate';

// set the default api and secrete key length
const apiKeyLength: number = 32;
const secreteKeyLength: number = 32;


// Post request for creating a new user
export const signUp = async (req: Request, res: Response) => {
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
    console.error('Error creating user', error);
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
    console.error('Error in login', error);
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

    const { _id, password, ...responseData } = getUser.toObject();

    res.status(200).json({ message: 'User retrieved successfully', data: responseData });
    return;
  } catch (error) {
    console.error('Error in get User details', error);
    res.status(500).json({ message: 'Error in get User details', error });
    return;
  }
}


// Patch request for updating the user document for new details
export const CreateAppSecreteAndKey = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    const foundedUser = await User.findOne({ _id: user });
    if (!foundedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { projectName, whitelistedURLs, callbackURL, redirectURL } = req.body;
    if (!whitelistedURLs || !Array.isArray(whitelistedURLs)) {
      res.status(400).json({ message: 'Invalid whitelistedURLs format' });
      return;
    }

    const apiKey = generateRandomString(apiKeyLength);
    const secreteKey = generateRandomString(secreteKeyLength);

    const newProject = {
      projectName,
      apiKey,
      secreteKey,
      callbackURL,
      redirectURL,
      whitelistedURLs,
    };

    foundedUser.projects.push(newProject);
    await foundedUser.save();

    const { _id, password, ...responseData } = foundedUser.toObject();

    res.status(200).json({ message: 'Updated AppSecrete', updatedAppData: responseData });
    return;
  } catch (error) {
    console.error('Error in updating AppSecrete:', error);
    res.status(500).json({ message: 'Error in updating AppSecrete', error });
    return;
  }
};


// Patch api for regenerate the api key and secrete key
export const regenerateKeys = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { projectId, projectName } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const project = user.projects.find(project => project._id == projectId && projectName);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    project.apiKey = generateRandomString(apiKeyLength);
    project.secreteKey = generateRandomString(secreteKeyLength);

    await user.save();

    res.status(200).json({ message: 'API key and secret key regenerated successfully', project });
    return;
  } catch (error) {
    console.error('Error in regenerating keys:', error);
    res.status(500).json({ message: 'Error in regenerating keys', error });
    return;
  }
};


// Patch api for update other data 
export const updateAppSecrete = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;

    const foundedUser = await User.findOne({ _id: user });

    if (!foundedUser) {
      res.status(404).json({ message: 'AppSecrete not found for the user' });
      return;
    }
    const { projectId, projectName } = req.params;
    const { callbackURL, redirectURL, whitelistedURLs } = req.body;

    const projectIndex = foundedUser.projects.findIndex(project => project._id == projectId && projectName);
    if (projectIndex === -1) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (callbackURL !== undefined) {
      foundedUser.projects[projectIndex].callbackURL = callbackURL;
    }
    if (redirectURL !== undefined) {
      foundedUser.projects[projectIndex].redirectURL = redirectURL;
    }
    if (whitelistedURLs !== undefined) {
      foundedUser.projects[projectIndex].whitelistedURLs = whitelistedURLs;
    }

    await foundedUser.save();

    res.status(200).json({ message: 'Updated AppSecrete', updatedProject: foundedUser.projects[projectIndex] });
    return;
  } catch (error) {
    console.error('Error in updating AppSecrete', error);
    res.status(500).json({ message: 'Error in updating AppSecrete', error });
    return;
  }
};


// Delete api for perticular project
export const deleteAppSecrete = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { projectId, projectName } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const projectIndex = user.projects.findIndex(p => p._id == projectId && p.projectName === projectName);
    if (projectIndex === -1) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    user.projects.splice(projectIndex, 1);

    await user.save();

    const { _id, password, ...responseData } = user.toObject();

    res.status(200).json({ message: 'Project deleted successfully', data: responseData });
    return;
  } catch (error) {
    console.error('Error in deleting project:', error);
    res.status(500).json({ message: 'Error in deleting project', error });
    return;
  }
}