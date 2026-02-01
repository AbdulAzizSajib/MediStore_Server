import { Request, Response } from "express";
import { reviewService } from "./review.service";

export interface customerReviewType {
    medicineId: string;
    rating: number;
    comment?: string;
}

const createCustomerReview = async (req: Request , res: Response) => {
    try {
        const user = req.user;
        console.log(user?.id)
        const payload: customerReviewType = {
            medicineId: req.body.medicineId,
            rating: req.body.rating,
            comment: req.body.comment,
        };
        
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        
        // Basic validation
        if (!payload.medicineId || !payload.rating) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID and rating are required",
            });
        }
        
        const result = await reviewService.createCustomerReview(user?.id, payload);
        
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Create review error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create review",
        });
    }
};

const updateCustomerReview = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const payload: customerReviewType = {
            medicineId: req.body.medicineId,
            rating: req.body.rating,
            comment: req.body.comment,
        };

        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Basic validation
        if (!payload.medicineId || !payload.rating) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID and rating are required",
            });
        }

        const result = await reviewService.updateCustomerReview(user?.id, payload);

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Update review error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update review",
        });
    }
};

export const reviewController = {
    createCustomerReview,
    updateCustomerReview,
};