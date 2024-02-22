import * as dotenv from 'dotenv';
dotenv.config();


export interface EnvironmentConfig {
  JWT_SECRET: string;
  SERVER_PORT: number;
  DB_URL: string;

}

export const environmentConfig: EnvironmentConfig = {
  JWT_SECRET: process.env.jwtSecretKey || 'defaultSecret',
  SERVER_PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  DB_URL: process.env.dbUrl || 'mongodb://localhost:27017/test',
};