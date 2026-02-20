import express,{Request,Response,NextFunction} from 'express';

declare global{
    namespace Express{
        interface Request{
            requestTime : string;
        }
    }
}
export const requestLogger = async(req : Request,res: Response, next : NextFunction) =>{
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;

    req.requestTime = new Date().toISOString();
    console.log(`[${method}] ${url} - ${ip} Time: ${req.requestTime}`);

    next();
}