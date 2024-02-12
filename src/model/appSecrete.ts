import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAppSecrete extends Document {
    // userID: ObjectId;
    apiKey: string;
    secretKey: string;
    callbackURL: string;
    redirectURL: string;
}

const AppSecreteSchema: Schema = new Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: 'false' },
    apiKey: { type: String },
    secretKey: { type: String },
    callbackURL: { type: String, required: true },
    redirectURL: { type: String, required: true },
});

export default mongoose.model<IAppSecrete>('AppSecrete', AppSecreteSchema);
