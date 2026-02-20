import express,{Request,Response,NextFunction} from 'express';  
import Community from '../models/Community';
import Post from '../models/Post';

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
                message :"Community with this already exists!",
            })
            return;
        }
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
}

export const getAllCommunties = async(req: Request,res: Response, next: NextFunction) : Promise<void> =>{
    try{
        const communities = await Community.find().limit(20);
        
        res.status(200).json({
            message : "Data Fetched Successfully!",
            communities
        })
        return;
    }catch(error){
        console.log(error);
        res.status(500).json({
            message : "something went wrong"
        })
    }
}

export const getCommunityById = async(req : Request, res : Response, next: NextFunction) : Promise<void> =>{
    try{
        const communityId = req.params.id;
        const [community,posts] = await Promise.all([
            Community.findById(communityId),
             Post.find({community : req.params.id}).sort({createdAt: -1}).populate('author','-password') 
        ])
        if (!community) {
            res.status(404).json({ message: "Community not found" });
            return;
        }

        res.status(200).json({
            message: "Data Fetched Successfully",
            community,
            posts
        })

    }catch(error: any){
        console.log(error);
        if (error.name === 'CastError') {
             res.status(404).json({ message: "Community not found" });
             return;
        }
        res.status(500).json({
            message : "something went wrong"
        })
    }
}