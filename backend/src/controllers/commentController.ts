import express,{Request,Response,NextFunction} from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
export const createComment = async(req : Request, res : Response, next : NextFunction): Promise<void> =>{
    try{
        const {content,postId,parentComment} = req.body;
        const authorId = req.user?._id;

        if(!content || !postId){
            res.status(400).json({
                message : "Content and Post are required",
            })
            return;
        }

        const checkPost = await Post.findById(postId);
        if(!checkPost){
            res.status(400).json({
                message : "Post Does not Exist",
            })
            return;
        }
        if(parentComment){
            const checkParent = await Comment.findById(parentComment);
            if(!checkParent){
                res.status(400).json({
                    message : "Parent Comment Does not exist"
                })
                return;
            }
            }
            

        const commentData : any = {
            content,
            post : postId,
            author : authorId
        }

        if(parentComment){
            commentData.parentComment = parentComment
        }

        const comment = new Comment(commentData);
        
        await comment.save();
        res.status(201).json({
            message : "commented successfully",
            comment
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message : "Something went wrong"
        })
    }
}
