import { Clerk } from '@clerk/clerk-js';
import { Request, Response, NextFunction } from "express";
import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dynamoose from 'dynamoose';
import courseRoutes from './routes/courseRoutes';
import serverless from 'serverless-http';
import { clerkMiddleware, createClerkClient, requireAuth } from '@clerk/express';
import userClerkRoutes from './routes/userClerkRoutes';
import transactionRoutes from './routes/transactionRoutes';
import UserCourseProgress from './models/userCourseProgressModel';
import userCourseProgressRoutes from './routes/userCourseProgressRoutes';
import seed from './seed/seedDynamodb';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if(isProduction) {
    dynamoose.aws.ddb.local();
}
export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})
const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use("/courses", courseRoutes )
app.use("/users/clerk", requireAuth(), userClerkRoutes)

app.use("/transactions", transactionRoutes)
app.use("/users/course-progress",userCourseProgressRoutes)
// SERVER
const port = process.env.PORT || 3000;
if(!isProduction) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// aws production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
    // this is function called by lambda: not the production way to do it: anyone can reseed our database, only temp
    if(event.action === "seed"){
        await seed();
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Data seeded successfully"})
        }

    }else{
        return serverlessApp(event, context);
    }
}