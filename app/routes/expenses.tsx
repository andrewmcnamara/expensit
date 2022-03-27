import {
  ActionIcon,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
  Paper,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { useState } from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { json, Link, Outlet, useLoaderData } from "remix";
import { MoonStars, Sun } from "tabler-icons-react";
import { db } from "~/utils/db.server.";

type LoaderData = {
  expenses: Array<{
    id: string;
    name: string;
    amount_cents?: BigInt | null;
    created_at?: Date | null;
    vendors: {
      id: string;
      name: string;
    } | null;
  }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    expenses: await db.expenses.findMany({
      include: { vendors: true },
      orderBy: { created_at: "asc" },
    }),
  };
  console.log(data);
  return json(data);
};

function asDollars(amount: BigInt) {
  var num = Number(amount) / 100;
  return num.toLocaleString("en-AU", { style: "currency", currency: "USD" });
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeStyle: "long",
});

function ExpensesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log({ data });
  // && dateFormat.format(expense.created_at)
  return (
    <Container size="md" px="xs">
      <Title order={1}>Expenses</Title>
      <Space h="lg" />
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Vendor</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {data.expenses.map((expense) => (
            <tr key={expense.id}>
              <td> {expense.name}</td>
              <td>{expense.amount_cents && asDollars(expense.amount_cents)}</td>
              <td>{expense.vendors?.name} </td>
              <td>
                {console.log({ date: expense.created_at })}
                {/* {dateFormat.format(new Date(expense.created_at))} */}
                {expense.created_at}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default function WithProvider() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const dark = colorScheme === "dark";

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme: colorScheme }} withGlobalStyles>
        <ActionIcon
          variant="outline"
          color={dark ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {" "}
          {dark ? <Sun size={18} /> : <MoonStars size={18} />}
        </ActionIcon>
        <ExpensesRoute />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
