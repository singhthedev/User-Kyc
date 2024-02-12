import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const dbUrl: string = process.env.dbUrl || '';
mongoose.connect(dbUrl)
    .then(() => {
        console.log(`Database connected successfully...🔥`);
    })
    .catch((err) => {
        console.log(err, `Database not connected...😵`);
    });