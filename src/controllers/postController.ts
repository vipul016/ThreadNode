import express,{Request,Response,NextFunction} from 'express';
import Post from '../models/Post';
import Community from '../models/Community';
import Comment from '../models/Comment';
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

export const getPostById = async(req : Request,res : Response, next : NextFunction): Promise<void> =>{
    try{
        const postId = req.params.id;

        const [post,comments] = await Promise.all([
            Post.findById(postId).lean(),
            Comment.find({post: postId}).populate('author','-password').lean()
        ])
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const roots: any[] = [];
        const map: Record<string,any> = {};
        
        comments.forEach((comment)=>{
            const commentString = comment._id.toString();
            map[commentString] = {...comment, replies : []}
        })
       
        comments.forEach((comment)=>{
            const idString = comment._id.toString();
            if(comment.parentComment){
                const parentIdString = comment.parentComment.toString();
                
                if(map[parentIdString]){
                    map[parentIdString].replies.push(map[idString]);
                }
            }else{
                roots.push(map[idString]);
            }
        })

        res.status(200).json({
            message: "Data Fetched Successfully",
            post,
            comments: roots
        });


    }
    catch(error){   
        console.log(error);
        res.status(500).json({
            message : "something went wrong",
        });
    }
}