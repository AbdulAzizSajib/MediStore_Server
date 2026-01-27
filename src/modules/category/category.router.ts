import Express from "express";
import { categoryController } from "./category.controller";

const categoryRouter = Express.Router();

categoryRouter.post("/", categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryId", categoryController.getCategoryById);
categoryRouter.put("/:categoryId", categoryController.updateCategory);
categoryRouter.delete("/:categoryId", categoryController.deleteCategory);

export default categoryRouter;
