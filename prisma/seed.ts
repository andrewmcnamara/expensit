import { categories, Prisma, PrismaClient, vendors } from "@prisma/client";
import { Chance } from "chance";
const db = new PrismaClient();
const chance = new Chance();
const { faker } = require("@faker-js/faker");

const categoryNames = [
  "Transport",
  "Food",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Other",
  "Insurance",
  "Clothing",
];

// const vendorNames = [...Array(10)].map(()=>faker.company.companyName(),
const vendorNames = [...Array(10)].map(() => faker.company.companyName());

function sample<T>(arr: T[]) {
  const len = arr == null ? 0 : arr.length;
  return len ? arr[Math.floor(Math.random() * len)] : undefined;
}

const createExpense = (
  vendor: vendors,
  category: categories
): Prisma.expensesCreateInput => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    amount_cents: chance.integer({ min: 100, max: 10000 }),
    created_at: chance.date({ string: false, year: 2020 }),
    vendors: { connect: { id: vendor.id } },
    categories: { connect: { id: category.id } },
  };
};

const seedCategories = async () =>
  await Promise.all(
    categoryNames.map(async (category) => {
      return await db.categories.upsert({
        where: {
          name: category,
        },
        update: {
          name: category,
        },
        create: {
          name: category,
        },
      });
    })
  );

const seedVendors = async () =>
  await Promise.all(
    vendorNames.map(async (vendor) => {
      return await db.vendors.upsert({
        where: {
          name: vendor,
        },
        update: {
          name: vendor,
        },
        create: {
          name: vendor,
        },
      });
    })
  );

async function seed() {
  // const vendor: Prisma.vendorsCreateInput = {
  //   name: faker.company.companyName(),
  // };
  const categories = await seedCategories();
  const vendors = await seedVendors();

  const randomCategory = () => sample<categories>(categories) || categories[0];
  const randomVendor = () => sample<vendors>(vendors) || vendors[0];

  await Promise.all(
    [...Array(10)].flatMap((idx) => {
      const vendor = faker.company.companyName();

      return [...Array(10)].map((idx) => {
        return db.expenses.create({
          data: createExpense(randomVendor(), randomCategory()),
        });
      });
    })
  );
}

seed();

function getExpenses() {
  return [
    {
      name: "Socks",
      amount_cents: 500,
      vendor_id: "ddd",
    },
  ];
}
// Vendor:{
//   create:{
//     name: expense.vendor
//   }
// }

// data:{
//   name: expense.name,
//   amountCents: expense.amountCents

// }
