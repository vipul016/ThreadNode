import mongoose from 'mongoose';

const connectDB = async() : Promise<void> =>{
    try{
        const uri = process.env.MONGO_URI || '';
        if(!uri){
            throw new Error(`no url found in env file`)
        }
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB connected : ${conn.connection.host}`);
    }catch(e){
        console.log(`Connection error ${(e as Error).message}`);
        process.exit(1);
    }
    
}
export default connectDB;