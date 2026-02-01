// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role UserRole? @default(CUSTOMER)\n\n  status    UserStatus? @default(ACTIVE)\n  medicines Medicine[]\n  orders    Orders[] // customer orders\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  phone   String?\n  address String?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// model for medicines\n\nmodel Medicine {\n  id          String   @id @default(uuid())\n  name        String\n  description String?\n  price       Decimal  @db.Decimal(10, 2)\n  stock       Int\n  imageUrl    String?\n  categoryId  String\n  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  sellerId String\n  seller   User   @relation(fields: [sellerId], references: [id], onDelete: Restrict)\n\n  status       MedicineStatus @default(AVAILABLE)\n  manufacturer String?\n  type         String?\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  orderItems   OrderItem[]\n  reviews      Review[]\n\n  @@index([sellerId])\n  @@index([categoryId])\n  @@index([name])\n}\n\n// model for categories\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  imageUrl    String?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n  medicines   Medicine[]\n}\n\n// model for orders\n\nmodel Orders {\n  id              String      @id @default(uuid())\n  userId          String\n  user            User        @relation(fields: [userId], references: [id], onDelete: Restrict)\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  status          OrderStatus @default(PLACED)\n  phone           String?\n  shippingAddress String\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n  orderItems      OrderItem[]\n\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n}\n\n// model for order items\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Orders   @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  // \n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  // \n  sellerId   String\n  seller     User     @relation(fields: [sellerId], references: [id], onDelete: Restrict)\n\n  quantity  Int\n  price     Decimal  @db.Decimal(10, 2)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sellerId])\n  @@index([orderId])\n}\n\n//model for reviews\n\nmodel Review {\n  id         String   @id @default(uuid())\n  userId     String\n  user       User     @relation(fields: [userId], references: [id], onDelete: Restrict)\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n}\n\nenum UserRole {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum MedicineStatus {\n  AVAILABLE\n  DISCONTINUED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"status","kind":"enum","type":"MedicineStatus"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"OrderItemToUser"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false
  },
  trustedOrigins: [process.env.FRONTEND_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      address: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  }
});

// src/modules/category/category.router.ts
import Express from "express";

// src/modules/category/category.service.ts
var createCategory = async ({
  name,
  description,
  imageUrl
}) => {
  const result = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      imageUrl: imageUrl ?? null
    }
  });
  return result;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};
var getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  return category;
};
var updateCategory = async (categoryId, data) => {
  return await prisma.category.update({
    where: {
      id: categoryId
    },
    data
  });
};
var deleteCategory = async (categoryId) => {
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.getCategoryById(categoryId);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.updateCategory(
      categoryId,
      req.body
    );
    res.status(200).json({
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.deleteCategory(categoryId);
    res.status(200).json({
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/middlewares/authGuard.ts
var authGuard = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      console.log("Session Data Today:", session);
      if (!session) {
        return res.status(401).json({ message: "You are not authorized" });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({ message: "Please verify your email to proceed." });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var authGuard_default = authGuard;

// src/modules/category/category.router.ts
var categoryRouter = Express.Router();
categoryRouter.post(
  "/",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryId", categoryController.getCategoryById);
categoryRouter.put(
  "/:categoryId",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
categoryRouter.delete(
  "/:categoryId",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var category_router_default = categoryRouter;

// src/modules/medicine/medicine.router.ts
import Express2 from "express";

// src/modules/medicine/medicine.service.ts
var createMedicine = async (payload, userId) => {
  const result = await prisma.medicine.create({
    data: {
      ...payload,
      sellerId: userId
    },
    include: {
      category: true
    }
  });
  return result;
};
var getAllMedicines = async ({
  search,
  category,
  minPrice,
  maxPrice,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (category) {
    andConditions.push({
      categoryId: category
    });
  }
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    andConditions.push({
      price: {
        ...minPrice !== void 0 && { gte: minPrice },
        ...maxPrice !== void 0 && { lte: maxPrice }
      }
    });
  }
  const Allmedicines = await prisma.medicine.findMany({
    where: {
      AND: andConditions
    },
    include: {
      category: true
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: Allmedicines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (medicineId) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      category: true
    }
  });
  return medicine;
};
var deleteMedicine = async (medicineId, userId) => {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  console.log("seller id:", medicine.sellerId);
  if (medicine.sellerId !== userId) {
    throw new Error("Unauthorized to delete this medicine");
  }
  await prisma.medicine.delete({
    where: { id: medicineId }
  });
};
var updateMedicine = async (payload, userId, medicineId) => {
  await prisma.medicine.findFirstOrThrow({
    where: {
      id: medicineId,
      sellerId: userId
    }
  });
  const result = await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data: {
      ...payload
    },
    include: {
      category: true
    }
  });
  return result;
};
var getAllMedicinesBySellerId = async (sellerId) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId
    },
    include: {
      category: true
    }
  });
  return medicines;
};
var medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  deleteMedicine,
  updateMedicine,
  getAllMedicinesBySellerId
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type
    };
    const result = await medicineService.createMedicine(
      payload,
      user?.id
    );
    res.status(201).json({
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getAllMedicines2 = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const minPriceNumber = minPrice ? parseFloat(minPrice) : void 0;
    const maxPriceNumber = maxPrice ? parseFloat(maxPrice) : void 0;
    const category = req.query.category;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
      req.query
    );
    const result = await medicineService.getAllMedicines({
      search: searchString,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
      category,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      message: "Medicines fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const medicine = await medicineService.getMedicineById(id);
    res.status(200).json({
      message: "Medicine fetched successfully",
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const user = req.user;
    await medicineService.deleteMedicine(id, user?.id);
    res.status(200).json({
      message: "Medicine deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const user = req.user;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type
    };
    const result = await medicineService.updateMedicine(
      payload,
      user?.id,
      id
    );
    res.status(200).json({
      message: "Medicine updated successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getAllMedicinesBySellerId2 = async (req, res) => {
  try {
    const user = req.user;
    const medicines = await medicineService.getAllMedicinesBySellerId(
      user?.id
    );
    res.status(200).json({
      message: "Medicines fetched successfully - seller wise",
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2,
  deleteMedicine: deleteMedicine2,
  updateMedicine: updateMedicine2,
  getAllMedicinesBySellerId: getAllMedicinesBySellerId2
};

// src/modules/medicine/medicine.router.ts
var medicineRouter = Express2.Router();
medicineRouter.post(
  "/",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.createMedicine
);
medicineRouter.get("/", medicineController.getAllMedicines);
medicineRouter.get(
  "/seller",
  authGuard_default("SELLER" /* SELLER */),
  medicineController.getAllMedicinesBySellerId
);
medicineRouter.get("/:id", medicineController.getMedicineById);
medicineRouter.delete(
  "/:id",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.deleteMedicine
);
medicineRouter.put(
  "/:id",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.updateMedicine
);
var medicine_router_default = medicineRouter;

// src/modules/order/order.router.ts
import Express3 from "express";

// src/modules/order/order.service.ts
var createOrder = async (payload, userId) => {
  return await prisma.$transaction(async (tx) => {
    const medicineIds = payload.orderItems.map((item) => item.medicineId);
    const medicines = await tx.medicine.findMany({
      where: {
        id: { in: medicineIds },
        status: "AVAILABLE"
      },
      select: {
        id: true,
        sellerId: true,
        price: true,
        stock: true,
        name: true
      }
    });
    if (medicines.length !== medicineIds.length) {
      const foundIds = medicines.map((m) => m.id);
      const notFound = medicineIds.filter((id) => !foundIds.includes(id));
      throw new Error(
        `Medicines not found or unavailable: ${notFound.join(", ")}`
      );
    }
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (!medicine) {
        throw new Error(`Medicine ${item.medicineId} not found`);
      }
      if (medicine.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`
        );
      }
    }
    let totalAmount = 0;
    const orderItemData = payload.orderItems.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;
      return {
        orderId: "",
        medicineId: item.medicineId,
        sellerId: medicine.sellerId,
        quantity: item.quantity,
        price: medicine.price
      };
    });
    const order = await tx.orders.create({
      data: {
        userId,
        totalAmount,
        phone: payload.phone,
        shippingAddress: payload.shippingAddress,
        status: "PLACED"
      }
    });
    orderItemData.forEach((item) => {
      item.orderId = order.id;
    });
    await tx.orderItem.createMany({
      data: orderItemData
    });
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      const newStock = medicine.stock - item.quantity;
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: newStock,
          status: newStock === 0 ? "DISCONTINUED" : "AVAILABLE"
        }
      });
    }
    return await tx.orders.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  });
};
var getUserOrders = async (userId) => {
  return await prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (orderId, userId) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== userId) {
    throw new Error("Unauthorized access to order");
  }
  return order;
};
var getOrderBySellerId = async (sellerId) => {
  const orderItemCount = await prisma.orderItem.count({
    where: { sellerId }
  });
  return await prisma.orders.findMany({
    where: {
      orderItems: {
        some: {
          sellerId
        }
      }
    },
    include: {
      orderItems: {
        where: {
          sellerId
        },
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateOrderStatus = async (orderId, status) => {
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(status)) {
    throw new Error(
      `Invalid order status. Must be one of: ${validStatuses.join(", ")}`
    );
  }
  const order = await prisma.orders.findUnique({
    where: { id: orderId }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return await prisma.orders.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
};
var getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      orderItems: {
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderBySellerId,
  updateOrderStatus,
  getAllOrders
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    if (!req.body.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }
    if (!req.body.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }
    if (!req.body.orderItems || !Array.isArray(req.body.orderItems)) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array"
      });
    }
    if (req.body.orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item"
      });
    }
    for (const item of req.body.orderItems) {
      if (!item.medicineId) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have medicineId"
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have a valid quantity"
        });
      }
    }
    const payload = {
      phone: req.body.phone,
      shippingAddress: req.body.shippingAddress,
      orderItems: req.body.orderItems.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity
      }))
    };
    const result = await orderService.createOrder(payload, user?.id);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
var getUserOrders2 = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getUserOrders(user?.id);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const order = await orderService.getOrderById(
      id,
      user?.id
    );
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order
    });
  } catch (error) {
    console.error("Get order error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : error.message.includes("Unauthorized") ? 403 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order"
    });
  }
};
var getOrderBySellerId2 = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getOrderBySellerId(user?.id);
    res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve seller orders"
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const result = await orderService.updateOrderStatus(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Update order status error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve all orders"
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getUserOrders: getUserOrders2,
  getOrderById: getOrderById2,
  getOrderBySellerId: getOrderBySellerId2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2
};

// src/modules/order/order.router.ts
var orderRouter = Express3.Router();
orderRouter.post(
  "/",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  orderController.createOrder
);
orderRouter.get(
  "/",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  orderController.getUserOrders
);
orderRouter.get(
  "/all",
  authGuard_default("ADMIN" /* ADMIN */),
  orderController.getAllOrders
);
orderRouter.get(
  "/seller",
  authGuard_default("SELLER" /* SELLER */),
  orderController.getOrderBySellerId
);
orderRouter.get(
  "/:id",
  authGuard_default("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  orderController.getOrderById
);
orderRouter.patch(
  "/:id/status",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.updateOrderStatus
);
var order_router_default = orderRouter;

// src/modules/user/user.router.ts
import Express4 from "express";

// src/modules/user/user.service.ts
var getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true
    }
  });
};
var userStatusUpdate = async (id, status) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      status
    }
  });
};
var userService = {
  getAllUsers,
  userStatusUpdate
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users"
    });
  }
};
var userStatusUpdate2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = await userService.userStatusUpdate(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status"
    });
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  userStatusUpdate: userStatusUpdate2
};

// src/modules/user/user.router.ts
var userRouter = Express4.Router();
userRouter.get("/", authGuard_default("ADMIN" /* ADMIN */), userController.getAllUsers);
userRouter.patch(
  "/:id/status",
  authGuard_default("ADMIN" /* ADMIN */),
  userController.userStatusUpdate
);
var user_router_default = userRouter;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
  res.status(200).send("Server is running...");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/category", category_router_default);
app.use("/api/medicine", medicine_router_default);
app.use("/api/order", order_router_default);
app.use("/api/user", user_router_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
