import express,{Request,Response,NextFunction} from 'express';

const getVIP = (req : Request,res: Response, next : NextFunction) => {
    if(req.headers['x-vip-pass'] == '1234'){
        next();
    }else{
        res.status(403).json({
            message : "You are Not VIP",
        })
    }
}

export default getVIP;