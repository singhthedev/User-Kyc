import mongoose from "mongoose";
import { environmentConfig } from "./envConfig";


const dbUrl: string = environmentConfig.DB_URL || '';
mongoose.connect(dbUrl)
    .then(() => {
        console.log(`Database connected...🔥`);
    })
    .catch((err) => {
        console.log(`Database not connected...😵`,err);
    });