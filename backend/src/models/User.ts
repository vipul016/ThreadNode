import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    username: string,
    email: string,
    password?:string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema : Schema<IUser> = new Schema({
    username : {
        type : String,
        required : [true, "username is required"],
        unique : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : true,
        lowercase : true,
        match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password : {
        type : String,
        required : [true, "password is required"],
        select : false
    },
},
{
    timestamps: true
})

const User = mongoose.model<IUser>('User',UserSchema);
export default User;