import express,{Request,Response,NextFunction} from 'express';
import Post from '../models/Post';
import Community from '../models/Community';

export const createPost = async(req : Request,res: Response, next : NextFunction) : Promise<void> =>{
    try{
        const {title,content,communityId} = req.body;

        if(!title || !content || !communityId){
            res.status(400).json({
                message : "All fields are required",
            })
            return;
        }
        const authorId = req.user?._id;
        const communityExists = await Community.findById(communityId);
        if(!communityExists){
            res.status(400).json({
                message : "Community does not exist"
            })
            return
        }
        const post = new Post({
            title,
            content,
            author : authorId,
            community : communityId,
        })

        await post.save();

        res.status(201).json({
            message: "post created successfully",
            post
        });
         
    }catch(error){
        console.log(error);
        res.status(500).json({
            message : "Something went wrong"
        })
    }
}