import { prisma } from "../../lib/prisma";
import { customerReview } from "./review.controller";

const createCustomerReview = async (
    userId: string,
    payload: customerReview
) => {
   
    if (payload.rating < 1 || payload.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

   
    // Check if user has purchased this medicine
    const orderItem = await prisma.orderItem.findFirst({
        where: {
            medicineId: payload.medicineId,
            order: { userId: userId },
        },
    });
    if (!orderItem) {
        throw new Error("You can only review medicines you have purchased");
    }


    // Create the review
    const review = await prisma.review.create({
        data: {
            userId: userId,
            medicineId: payload.medicineId,
            rating: payload.rating,
            comment: payload.comment || null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            medicine: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return review;
}

export const reviewService = {
    createCustomerReview,
};