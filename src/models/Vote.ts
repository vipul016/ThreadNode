import mongoose,{Schema,Document} from 'mongoose';

export interface IVote extends Document{
    user : mongoose.Types.ObjectId;
    item : mongoose.Types.ObjectId;
    onModel : 'Post' | 'Comment';
    value : number;
    createdAt : Date;
    updatedAt : Date;
}

const voteSchema : Schema<IVote> = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    item :{
        type : Schema.Types.ObjectId,
        required : true,
        refPath : 'onModel'
    },
    onModel: {
        type : String,
        required : true,
        enum : ['Comment','Post'],
    },
    value : {
        type : Number,
        required : true,
        enum : [-1,1],
    },

},{
    timestamps : true
})

voteSchema.index({user: 1,item : 1},{unique : true})

const Vote = mongoose.model<IVote>('Vote',voteSchema)
export default Vote;