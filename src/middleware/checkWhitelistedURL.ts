import { NextFunction, Request, Response } from "express";
import { UserType } from "./authToken";
import url from 'url';

export const checkWhitelistedURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey: string | undefined = req.headers['x-api-key'] ? String(req.headers['x-api-key']) : undefined;
        const secretKey: string | undefined = req.headers['x-secret-key'] ? String(req.headers['x-secret-key']) : undefined;        
        const refererHeader = req.headers.referer;

        if (!apiKey || !secretKey || !refererHeader) {
            res.status(403).json({ message: 'API key, secret key, or referer header not found in the request headers' });
            return;
        }

        const { host, protocol } = url.parse(refererHeader);

        if (!host || !protocol) {
            res.status(403).json({ message: 'Invalid referer header' });
            return;
        }

        const baseUrl = `${protocol}//${host}`;

        const user = req.user as UserType;

        const project = user.projects.find((project: { apiKey: string; secretKey: string; }) =>
            project.apiKey === apiKey && project.secretKey === secretKey
        );

        if (!project) {
            res.status(403).json({ message: 'Invalid API key or secret key' });
            return;
        }

        const whitelistedURLs = project.whitelistedURLs.map((urlObj: { url: any; }) => urlObj.url);

        const isWhitelisted = whitelistedURLs.some((whitelistedURL: string | RegExp) => {
            const regex = new RegExp(whitelistedURL, 'i');
            return regex.test(baseUrl);
        });

        if (isWhitelisted) {
            next();
        } else {
            res.status(403).json({ message: 'CORS error: Requested URL is not whitelisted' });
            return;
        }
    } catch (error) {
        console.error('Error in checking URL:', error);
        res.status(500).json({ message: 'Error in checking URL', error });
        return;
    }
};
