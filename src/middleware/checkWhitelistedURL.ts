import { NextFunction, Request, Response } from "express"
import { UserType } from "./authToken";

export const checkWhitelistedURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestedURL = req.headers.referer;
        const baseUrl = requestedURL?.split('/').slice(0, 3).join('/');

        if (!baseUrl) {
            throw new Error('Base URL not found in the request headers');
        }

        const user = req.user as UserType;
        const whitelistedURLs = user.projects.reduce((acc: string[], project: { whitelistedURL: any[]; }) => [...acc, ...project.whitelistedURL.map(url => url.url)], []);

        const isWhitelisted = whitelistedURLs.some((whitelistedURL: string | RegExp) => {
            const regex = new RegExp(whitelistedURL, 'i');
            return regex.test(baseUrl);
        });

        if (isWhitelisted) {
            next();
        } else {
            res.status(403).json({ message: 'CORS error: Requested URL is not whitelisted' });
        }
    } catch (error) {
        console.error('Error in checking URL:', error);
        res.status(500).json({ message: 'Error in checking URL', error });
    }
};
