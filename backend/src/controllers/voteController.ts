import { Request, Response, NextFunction } from 'express';
import Vote from '../models/Vote';
import mongoose from 'mongoose';

export const voteOnItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { itemId, itemType, value } = req.body;
        const userId = req.user?._id;

        // BUG 1 FIXED: Added 0 to the allowed array so users can remove their vote
        if (!itemId || !itemType || ![-1, 0, 1].includes(value)) {
            res.status(400).json({ message: "Invalid Vote Data!" });
            return;
        }

        const targetModel = mongoose.model(itemType);
        const existingVote = await Vote.findOne({ user: userId, item: itemId });

        let updatedItem;

        // SCENARIO A: A vote already exists
        if (existingVote) {
            // They sent 0 (remove) OR clicked the same button again
            if (value === 0 || existingVote.value === value) {
                await Vote.findByIdAndDelete(existingVote._id);
                
                const updateField = existingVote.value === 1 ? { upvotes: -1 } : { downvotes: -1 };
                
                // BUG 3 FIXED: Added { new: true } to grab the updated math
                updatedItem = await targetModel.findByIdAndUpdate(itemId, { $inc: updateField }, { new: true });
            } 
            // They are switching their vote
            else {
                existingVote.value = value;
                const updateField = value === 1 ? { upvotes: 1, downvotes: -1 } : { upvotes: -1, downvotes: 1 };
                
                updatedItem = await targetModel.findByIdAndUpdate(itemId, { $inc: updateField }, { new: true });
                await existingVote.save();
            }
        } 
        // SCENARIO B: Brand new vote
        else {
            if (value !== 0) {
                const newVote = new Vote({
                    user: userId,
                    item: itemId,
                    onModel: itemType,
                    value: value
                });
                await newVote.save();

                const updateField = value === 1 ? { upvotes: 1 } : { downvotes: 1 };
                updatedItem = await targetModel.findByIdAndUpdate(itemId, { $inc: updateField }, { new: true });
            } else {
            }
        }

        res.status(200).json({
            message: "Vote processed successfully",
            upvotes: updatedItem?.upvotes || 0,
            downvotes: updatedItem?.downvotes || 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong with voting" });
    }
};