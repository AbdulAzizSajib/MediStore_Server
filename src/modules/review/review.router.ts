import Express from 'express';
import { reviewController } from './review.controller';

const reviewRouter = Express.Router();

reviewRouter.post('/', reviewController.createCustomerReview);

export default reviewRouter;