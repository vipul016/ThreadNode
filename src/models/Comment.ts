import mongoose,{Schema,Document, mongo} from 'mongoose';

export interface IComment extends Document{
    content : string;
    author : mongoose.Types.ObjectId;
    post : mongoose.Types.ObjectId;
    parentComment ?: mongoose.Types.ObjectId;
    upvotes : number;
    downvotes : number;
    isDeleted : boolean;
    createdAt : Date;
    updatedAt : Date;
}

const commentSchema : Schema<IComment> = new Schema({
    content : {
        type : String,
        required : true,
        maxLength : 10000
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    post : {
        type : Schema.Types.ObjectId,
        ref: 'Post',
        required : true,
    },
    parentComment : {
        type : Schema.Types.ObjectId,
        ref : 'Comment',
        default : null,
    },
    upvotes : {
        type : Number,
        default : 0,
    },
    downvotes : {
        type : Number,
        default : 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

},{
    timestamps : true,
});

commentSchema.index({post : 1, createdAt : 1});

const Comment = mongoose.model<IComment>('Comment',commentSchema);
export default Comment;