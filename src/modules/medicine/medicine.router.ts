import Express from "express";
import { medicineController } from "./medicine.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const medicineRouter = Express.Router();

medicineRouter.post(
  "/",
  authGuard(UserRole.SELLER, UserRole.ADMIN),
  medicineController.createMedicine,
);

medicineRouter.get("/", medicineController.getAllMedicines);
medicineRouter.get("/:id", medicineController.getMedicineById);

export default medicineRouter;
