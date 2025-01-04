import Stripe from 'stripe';
import dotenv from 'dotenv';
import {Request, Response} from 'express';
import Course from '../models/courseModel';
import Transaction from '../models/transactionModel';
import UserCourseProgress from '../models/userCourseProgressModel';
import { transaction } from 'dynamoose';
dotenv.config();

if(!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe Secret Key not found");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createStripePaymentIntent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    let { amount } = req.body;
  
    if (!amount || amount <= 0) {
      amount = 50;
    }
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
  
      res.json({
        message: "",
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating stripe payment intent", error });
    }
  };

  export const createTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {userId, courseId, amount, transactionId , paymentProvider} = req.body;
    try {
        const course = await Course.get(courseId);

        const newTransaction  = new Transaction({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider
        })
        await newTransaction.save();

        // 3. create initial course progress
        const initialProgress = new UserCourseProgress({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section: any) => ({

                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter: any) => ({
                    chapterId: chapter.chapterId,
                    completed: false
                }))
                
             })),
             lastAccessedTimestamp: new Date().toISOString()

        })
        await initialProgress.save();
        await Course.update({courseId}, {
            $ADD: {enrollments: [{userId}]}
        });


        res.json({
            message: "Purchased course successfully",
            data: {
                transaction: newTransaction,
                progress: initialProgress
            }
        })
    } catch (error) {
        res.status(500).json({message: "Error purchasing course", error})
    }


  
  };