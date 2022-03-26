import { Prisma, PrismaClient, vendors } from "@prisma/client";
import { Chance } from "chance";
const db = new PrismaClient();
const chance = new Chance();
const { faker } = require("@faker-js/faker");

async function seed() {
  // const vendor: Prisma.vendorsCreateInput = {
  //   name: faker.company.companyName(),
  // };

  const createExpense = (vendpr:String): Prisma.expensesCreateInput => {
    const companyName = faker.company.companyName();
    return {
      name: faker.commerce.productName(),
      amount_cents: chance.integer({ min: 100, max: 10000 }),
      vendors: {
        connectOrCreate: {
          where: {
            name: companyName,
          },
          create: {
            name: companyName,
          },
        },
      },
    };
  };

  await Promise.all(
    [...Array(10)].map((idx) => {
      return db.expenses.create({ data: createExpense() });
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
