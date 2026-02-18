import {Request,Response,NextFunction} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async(req : Request, res : Response, next: NextFunction) =>{
    try{
        const {username,password,email} = req.body
        
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const checkUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (checkUser) {
            res.status(400).json({ message: "User or Email already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username : username,
            email : email,
            password : hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "User Created Successfully",
            userId: user._id
        });

    }catch(error){
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
}
export const loginUser = async(req : Request,res: Response,next : NextFunction) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            res.status(400).json({
                message : "All fields are required"
            });
            return;
        }
        const user = await User.findOne({email}).select('+password');

        if(!user || !user.password){
            res.status(400).json({
                message: "invalid credentials"
            })
            return;
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            res.status(400).json({
                message: "invalid credentials"
            }) 
            return;
            
        }
        const token = jwt.sign(
            {id : user._id },              
            process.env.JWT_SECRET as string,   
            { expiresIn: "1h" }               
        );
        res.status(200).json({
            success: true,
            message :"login successfull",
            token,
            user: { id: user._id, username: user.username }
        })
        
    }catch(error){
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
}