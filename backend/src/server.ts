import express, {Application,Request,Response,NextFunction} from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db/db';
import authRoutes from './routes/authRoutes';
import getVIP from './middleware/vipMiddleware';
import { requestLogger } from './middleware/logger';
import communityRoutes from './routes/communityRoutes'
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import voteRoutes from './routes/voteRoutes';
dotenv.config();
connectDB()
const app : Application = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(requestLogger);
app.use('/api/auth',authRoutes);
app.use('/api/communities',communityRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/votes',voteRoutes)

app.get('/',getVIP,(req: Request, res: Response) =>{
    res.status(200).json({
        status : 'UP',
        message : `Server is running`
    })
});

app.listen(port,()=>{
    console.log(`ThreadNode is running at port ${port}`);
})