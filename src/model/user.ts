import mongoose, { Schema, Document } from 'mongoose';

export interface IProject {
  projectName: string;
  apiKey: string;
  secreteKey: string;
  callbackURL: string;
  redirectURL: string;
  whitelistedURLs: { url: string }[];
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  projects: IProject[];
}

const ProjectSchema: Schema = new Schema({
  projectName: { type: String },
  apiKey: { type: String },
  secreteKey: { type: String },
  callbackURL: { type: String },
  redirectURL: { type: String },
  whitelistedURLs: [{ url: { type: String } }],
});

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  projects: [ProjectSchema],
});

export default mongoose.model<IUser>('User', UserSchema);
