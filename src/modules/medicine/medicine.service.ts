import { prisma } from "../../lib/prisma";

const createMedicine = async (
  payload: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: string;
    manufacturer?: string;
    type?: string;
  },
  userId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...payload,
      sellerId: userId,
    },
  });
  return result;
};

const getAllMedicines = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: any[] = [];
  console.log(andConditions);
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  const Allmedicines = await prisma.medicine.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      category: true,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.medicine.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: Allmedicines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      category: true,
    },
  });
  return medicine;
};

export const medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
};
