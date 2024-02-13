import express  from 'express';
import './src/config/db';
import bodyParser from 'body-parser';
import { configCorsOptions } from './src/config/corsConfig';
import { environmentConfig } from './src/config/envConfig';


import router from './src/router/allRoute';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(configCorsOptions());

app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(environmentConfig.SERVER_PORT || 3000, () => {
    console.log(`Server is running...🚀`);
    const error = false;
    if (error) {
        console.log(`Server error...🫣`,error);
    }
})