import cors,{ CorsOptions } from 'cors';

// define the types
interface customCorsOptions {
    origin?: string | string[];
    methods?: string | string[];
    credentials: string | boolean;
}


// configure the cors
export const configCorsOptions = ({ }: customCorsOptions = {}) => {
    const options: CorsOptions = {
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        credentials: true
    }
    return cors(options)
}