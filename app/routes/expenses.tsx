import {
  ActionIcon,
  Card,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  Drawer,
  Group,
  Image,
  MantineProvider,
  Modal,
  Paper,
  Space,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from "remix";
import { json, Link, Outlet, useLoaderData } from "remix";
import {
  Abacus,
  Bus,
  MoonStars,
  Music,
  Pizza,
  Power,
  QuestionMark,
  Shirt,
  ShoppingCart,
  Sun,
  Umbrella,
} from "tabler-icons-react";
import { db } from "~/utils/db.server.";
import { Prisma } from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const project = await createProject(formData);
  return redirect(`/projects/${project.id}`);
};

interface Expense {
  id: string;
  name: string;
  description?: string | null;
  amount_cents?: BigInt | null;
  created_at?: Date | null;
  categories?: {
    id: string;
    name: string | null;
  } | null;
  vendors: {
    id: string;
    name: string;
  } | null;
}

type LoaderData = {
  expenses: Array<Expense>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    expenses: await db.expenses.findMany({
      include: { vendors: true, categories: true },
      orderBy: { created_at: "asc" },
    }),
  };
  console.log(data);
  return json(data);
};

function asDollars(amount: BigInt) {
  var num = Number(amount) / 100;
  return num.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
});

const categoryIcons = {
  Transport: Bus,
  Food: Pizza,
  Entertainment: Music,
  Shopping: ShoppingCart,
  Utilities: Power,
  Other: QuestionMark,
  Insurance: Umbrella,
  Clothing: Shirt,
};

const Title: React.FunctionComponent<{ expense: Expense }> = ({ expense }) => {
  return <></>;
};

function ExpenseForm({ expense }: { expense: Expense }) {
  return (
    <form>
      <TextInput label="Name" value={expense.name} />
      <TextInput label="Vendor" value={expense.vendors?.name} />
      <TextInput label="Amount" value={expense.amount_cents || ""} />
      {/* <Select
      label="Vendor"
      data={data}
      placeholder="Select items"
      nothingFound="Nothing found"
      searchable
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => setData((current) => [...current, query])}
    /> */}
      <Textarea label="Description" value={expense.description || ""} />
    </form>
  );
}

function ExpenseRowModal(expense: Expense) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  const CategoryIcon =
    categoryIcons[
      (expense.categories?.name || "Other") as keyof typeof categoryIcons
    ];
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Expense details"
        padding="xl"
        size="md"
      >
        <Title expense={expense} />
        <ExpenseForm expense={expense} />
        <Card shadow="sm" p="xl">
          <Card.Section>
            <Group position="left" style={{ marginTop: 5 }}>
              <CategoryIcon />
              <Text weight={500}>{expense.name}</Text>
            </Group>
          </Card.Section>
          <Space h="lg" />
          <Text size="md" style={{ color: secondaryColor, lineHeight: 1.5 }}>
            {expense?.description}
          </Text>
        </Card>
      </Modal>
      <td> {expense.name}</td>
      <td>{expense.amount_cents && asDollars(expense.amount_cents)}</td>
      <td>{expense.vendors?.name} </td>
      <td>
        {/* {console.log({ date: expense.created_at })} */}
        {/* {dateFormat.format(new Date(expense.created_at))} */}
        {expense.created_at}
      </td>
      <td>
        <Abacus
          size={22}
          strokeWidth={2}
          color={"#ab40bf"}
          style={{ cursor: "hand" }}
          onClick={() => setOpened(true)}
        >
          Open Drawer
        </Abacus>
      </td>
    </>
  );
}

function ExpenseRowDrawer(expense: {
  id: string;
  name: string;
  description: string | null;
  amount_cents?: BigInt | null;
  created_at?: Date | null;
  categories?: { id: string; name: string | null } | null;
  vendors: { id: string; name: string } | null;
}) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  const CategoryIcon =
    categoryIcons[
      (expense.categories?.name || "Other") as keyof typeof categoryIcons
    ];
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Expense details"
        padding="xl"
        size="md"
        position="right"
      >
        <Card shadow="sm" p="xl">
          <Card.Section>
            <Group position="left" style={{ marginTop: 5 }}>
              <CategoryIcon />
              <Text weight={500}>{expense.name}</Text>
            </Group>
          </Card.Section>
          <Space h="lg" />
          <Text size="md" style={{ color: secondaryColor, lineHeight: 1.5 }}>
            {expense?.description}
          </Text>
        </Card>
      </Drawer>
      <td> {expense.name}</td>
      <td>{expense.amount_cents && asDollars(expense.amount_cents)}</td>
      <td>{expense.vendors?.name} </td>
      <td>
        {/* {console.log({ date: expense.created_at })} */}
        {/* {dateFormat.format(new Date(expense.created_at))} */}
        {expense.created_at}
      </td>
      <td>
        <Abacus
          size={22}
          strokeWidth={2}
          color={"#ab40bf"}
          style={{ cursor: "hand" }}
          onClick={() => setOpened(true)}
        >
          Open Drawer
        </Abacus>
      </td>
    </>
  );
}

function ExpensesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log({ data });
  const xx = data.expenses[0];
  // && dateFormat.format(expense.created_at)
  return (
    <Container size="md" px="xs">
      <Title order={1}>Expenses</Title>
      <Space h="lg" />
      <Table
        striped
        highlightOnHover
        horizontalSpacing="sm"
        verticalSpacing="md"
        fontSize="sm"
      >
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
              {/* <ExpenseRowDrawer {...expense} /> */}
              <ExpenseRowModal {...expense} />
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
