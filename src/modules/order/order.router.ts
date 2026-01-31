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

// Specific routes MUST come before dynamic :id route
orderRouter.get(
  "/seller",
  authGuard(UserRole.SELLER),
  orderController.getOrderBySellerId,
);

orderRouter.get(
  "/:id",
  authGuard(UserRole.CUSTOMER),
  orderController.getOrderById,
);

orderRouter.patch(
  "/:id/status",
  authGuard(UserRole.SELLER, UserRole.ADMIN),
  orderController.updateOrderStatus,
);

export default orderRouter;
