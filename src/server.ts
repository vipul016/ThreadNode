import express, {Application,Request,Response,NextFunction} from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db/db';
import authRoutes from './routes/authRoutes';
import getVIP from './middleware/vipMiddleware';
dotenv.config();
connectDB(
)
const app : Application = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);

app.get('/',getVIP,(req: Request, res: Response) =>{
    res.status(200).json({
        status : 'UP',
        message : `Server is running`
    })
});

app.listen(port,()=>{
    console.log(`ThreadNode is running at port ${port}`);
})