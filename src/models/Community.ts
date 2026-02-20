import mongoose,{Schema,Document} from 'mongoose';

export interface ICommunity extends Document{
    name : string;
    description : string;
    creator : mongoose.Types.ObjectId;
    members : mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};

const CommunitySchema : Schema<ICommunity> = new Schema({
    name: {
        type : String,
        required: true,
        unique : true,
        trim : true,
        lowercase: true,
        maxlength : 21
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    creator: {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    members : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
},
{
    timestamps : true,
});

CommunitySchema.index({name : 1});

const Community = mongoose.model<ICommunity>('Community', CommunitySchema);
export default Community;