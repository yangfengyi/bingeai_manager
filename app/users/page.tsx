import { getAllUsers } from '../(components)/user/user-query-action';
import UserTable, { type User } from '../(components)/user/user-table';

// request comes in, at most once every 60 seconds.
export const revalidate = 60;

export default async function User() {
  const users = (await getAllUsers()) as { users: User[] };

  return <UserTable data={users.users} />;
}
