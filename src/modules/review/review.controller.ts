import { Request, Response } from "express";
import { reviewService } from "./review.service";

export interface customerReview {
    medicineId: string;
    rating: number;
    comment?: string;
}

const createCustomerReview = async (req: Request , res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const payload = req.body;
        
        // Basic validation
        if (!payload.medicineId || !payload.rating) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID and rating are required",
            });
        }
        
        const result = await reviewService.createCustomerReview(userId, payload as customerReview);
        
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

export const reviewController = {
    createCustomerReview,
};