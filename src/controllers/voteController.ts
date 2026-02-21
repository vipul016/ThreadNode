import express,{Request,Response,NextFunction} from 'express';
import Vote from '../models/Vote';
import User from '../models/User';
import Post from '../models/Post';
import mongoose from 'mongoose';

export const voteOnItem = async(req : Request,res: Response, next: NextFunction): Promise<void> => {
    try{
        
        const {itemId,itemType,value} = req.body;
        const userId = req.user?._id;

        if(!itemId || !itemType || ![-1,1].includes(value)){
            res.status(400).json({
                message : "Invalid Vote Data!"
            })
            return;
        }

        const targetModel = mongoose.model(itemType);


        const existingVote = await Vote.findOne({user : userId,item : itemId});

        if(existingVote){
            if(existingVote.value === value){
                await Vote.findByIdAndDelete(existingVote._id);
                const updateField = value === 1 ? {upvotes : -1} : {downvotes : 1};
                await targetModel.findByIdAndUpdate(itemId,{$inc : updateField})
                res.status(200).json({ message: "Vote removed" });
                return;
            }else{
                existingVote.value = value
                const updateField = value === 1 ? {upvotes : 1,downvotes : -1} : {upvotes : -1,downvotes: 1}
                await targetModel.findByIdAndUpdate(itemId,{$inc: updateField});
                await existingVote.save();
                res.status(200).json({message : "Vote changed"});
                return;
            }
        }
        const newVote = new Vote({
            user : userId,
            item : itemId,
            onModel : itemType,
            value : value
        });

        await newVote.save();
        const updateField = value === 1 ? { upvotes: 1 } : { downvotes: 1 };
        await targetModel.findByIdAndUpdate(itemId, { $inc: updateField });

        res.status(201).json({
            message : "vote casted successfully",
            vote : newVote
        })

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Something went wrong with voting" })
    }
}