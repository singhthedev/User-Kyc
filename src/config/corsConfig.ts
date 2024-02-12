import cors,{ CorsOptions } from 'cors';


interface customCorsOptions {
    origin?: string | string[];
    methods?: string | string[];
    credentials: string | boolean;
}

export const configCorsOptions = ({ }: customCorsOptions = {}) => {
    const options: CorsOptions = {
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        credentials: true
    }
    return cors(options)
}