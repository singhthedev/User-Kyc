import express  from 'express';
import './src/config/db';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import { configCorsOptions } from './src/config/corsConfig';

import router from './src/router/allRoute';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(configCorsOptions());

app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running...🚀`);
    const error = false;
    if (error) {
        console.log(`Server error...🫣`);
    }
})