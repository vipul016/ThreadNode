import mongoose,{Schema,Document} from 'mongoose';

export interface IPost extends Document{
    title : string;
    content: string;
    author: mongoose.Types.ObjectId;
    community : mongoose.Types.ObjectId;
    upvotes : number;
    downvotes : number;
    createdAt : Date,
    updatedAt : Date
};

const PostSchema : Schema<IPost> = new Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        maxLength : 300
    },
    content: {
        type : String,
        required : true
    },
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User',
        requiredd : true,
    },
    community : {
        type : Schema.Types.ObjectId,
        ref : 'Community',
        required : true
    },
    upvotes: {
            type: Number,
            default: 0,
    },
    downvotes: {
            type: Number,
            default: 0,
    }

},
{
    timestamps: true
});

PostSchema.index({community : 1, createdAt: -1});

const Post  = mongoose.model<IPost>('Post',PostSchema);
export default Post;
