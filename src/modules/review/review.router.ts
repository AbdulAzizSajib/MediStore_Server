import Express from 'express';
import { reviewController } from './review.controller';
import authGuard, { UserRole } from "../../middlewares/authGuard";

const reviewRouter = Express.Router();

reviewRouter.post('/', authGuard(UserRole.CUSTOMER), reviewController.createCustomerReview);
reviewRouter.put('/', authGuard(UserRole.CUSTOMER), reviewController.updateCustomerReview);

export default reviewRouter;