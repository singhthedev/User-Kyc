import { Request, Response } from 'express';
import AppSecrete, { IAppSecrete } from '../model/appSecrete';


// set the default api and secrete key length
const apiKeyLength: number = 32;
const secreteKeyLength: number = 32;


// generate the mixed api and secret key using this function
const generateRandomString = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
};


// Post request for creating a new app secrete and secret key
export const AppSecreteAndKey = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    const { callbackURL, redirectURL } = req.body;

    const fieldRequired = ['callbackURL', 'redirectURL']
    const missingField = fieldRequired.filter(field => !req.body[field]);
    if (missingField.length > 0) {
      const missingFieldMessage = missingField.join(', ');
      res.status(400).json({ message: `${missingFieldMessage} field is required` });
      return;
    }

    const existingAppKey = await AppSecrete.findOne({ userID: user });
    if (existingAppKey) {
      res.status(400).json({ message: 'App Key already exists' });
      return;
    }

    const apiKey = generateRandomString(apiKeyLength);
    const secreteKey = generateRandomString(secreteKeyLength);

    const appKey: IAppSecrete = new AppSecrete({
      userID: user,
      apiKey,
      secreteKey,
      callbackURL,
      redirectURL
    });

    await appKey.save();

    const { userID, ...responseData } = appKey.toObject();

    res.status(201).json({ message: 'Key created successfully', appKey: responseData });
    return;
  } catch (error) {
    console.error('Error in creating AppSecrete');
    res.status(500).json({ message: 'Error in creating AppSecrete', error });
    return;
  }
};


// Get request for app secrete key
export const getAppSecrete = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    const appKey = await AppSecrete.findOne({ userID: user });

    if (!appKey) {
      res.status(404).json({ message: 'Data not found' });
      return;
    }

    const { userID, ...responseData } = appKey.toObject();

    res.status(200).json({ message: 'Key retrieved successfully', appKey: responseData });
    return;
  } catch (error) {
    console.error('Error in getting AppSecrete');
    res.status(500).json({ message: 'Error in getting AppSecrete', error });
    return;
  }
}


// Patch request for update appSecrete and secrete key
export const updateAppSecrete = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    const foundedUser = await AppSecrete.findOne({ userID: user });
    if (!foundedUser) {
      return res.status(404).json({ message: 'AppSecrete not found for the user' });
    }

    const { callbackURL, redirectURL } = req.body;
    const updatedAppData = await AppSecrete.findByIdAndUpdate(foundedUser._id, { callbackURL, redirectURL }, { new: true });
    if (!updatedAppData) {
      return res.status(404).json({ message: 'AppSecrete not found for the user' });
    }

    const { userID, ...responseData } = updatedAppData.toObject();

    res.status(200).json({ message: 'Updated AppSecrete', updatedAppData: responseData })
    return;
  } catch (error) {
    console.error('Error in updating AppSecrete');
    res.status(500).json({ message: 'Error in updating AppSecrete', error });
    return;
  }
}


// Delete request for deleting AppSecrete by created user
export const deleteAppSecrete = async (req: Request, res: Response) => {
  try {
    const user = req.user?.userId;
    const foundedUser = await AppSecrete.findOne({ userID: user });
    if (!foundedUser) {
      res.status(404).json({ message: 'AppSecrete not found for the user' });
      return;
    }

    const deleteAppSecreteResponse = await AppSecrete.findByIdAndDelete(foundedUser._id)
    if (!deleteAppSecreteResponse) {
      res.status(404).json({ message: 'AppSecrete not found' });
      return;
    }

    res.status(200).json({ message: 'AppSecrete deleted successfully' })
    return;
  } catch (error) {
    console.error('Error in deleting AppSecrete');
    res.status(500).json({ message: 'Error in deleting AppSecrete', error });
    return;
  }
}