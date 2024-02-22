import express from 'express';
import './src/config/db';
import bodyParser from 'body-parser';
import { configCorsOptions } from './src/config/corsConfig';
import { environmentConfig } from './src/config/envConfig';
import cluster from 'cluster';
import os from 'os';
import router from './src/router/allRoute';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running...👍️`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(configCorsOptions());

    app.use('/api/v1', router);

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(environmentConfig.SERVER_PORT || 3000, () => {
        console.log(`Worker ${process.pid} started...🚀`);
    });
}

