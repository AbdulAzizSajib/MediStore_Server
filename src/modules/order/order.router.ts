import Express from "express";
import { orderController } from "./order.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const orderRouter = Express.Router();

orderRouter.post(
  "/",
  authGuard(UserRole.CUSTOMER),
  orderController.createOrder,
);
orderRouter.get(
  "/",
  authGuard(UserRole.CUSTOMER),
  orderController.getUserOrders,
);
orderRouter.get(
  "/:id",
  authGuard(UserRole.CUSTOMER),
  orderController.getOrderById,
);

export default orderRouter;
