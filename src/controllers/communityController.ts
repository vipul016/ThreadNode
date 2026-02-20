import express,{Request,Response,NextFunction} from 'express';  
import Community from '../models/Community';

export const createCommunity = async(req: Request,res: Response,next: NextFunction): Promise<void> =>{
    try{
        const {name,description} = req.body;
        
        if(!name || !description){
            res.status(400).json({
                message : "All fields are required"
            });
            return;
        }

        const creatorId = req.user?._id;
        
        const community = new Community({
            name,
            description,    
            creator: creatorId,
            members : [creatorId]
        });

        await community.save();

        res.status(201).json({
            message : "Community Created Successfully",
            community,
                
        })

    }catch(error : any){    
        if(error.code === 11000){
            res.status(409).json({
                message :"Community with this already exists!";
            })
            return;
        }
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
}