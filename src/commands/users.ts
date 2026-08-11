import { setUser, readConfig } from "../config";
import { createUser, getUser, getUsers, resetUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];

  const user = await getUser(userName);

  if (!user) {
    throw new Error("You can't login to an account that doesn't exist!");
  }

  setUser(userName);

  console.log("User switched successfully!");
}

export async function handlerRegisterUser(cmdName: string, ...args: string[]): Promise<any> {
  if (args.length === 0) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];

  const res = await createUser(userName);
  setUser(res.name);

  console.log("User created.");
  console.log(res);
}

export async function handlerReset(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  try {
    await resetUsers();
    console.log("Database reset successfully.");
  } catch (err) {
    throw new Error("Failed to reset database.");
  }
}

export async function handlerUsers(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const users = await getUsers();
  const config = readConfig();

  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}