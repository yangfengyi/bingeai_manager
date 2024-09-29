import { getAllUsers } from '../(components)/user/user-query-action';
import UserTable from '../(components)/user/user-table';

export default async function User() {
  const users = (await getAllUsers()) as any;

  return <UserTable data={users.users} />;
}
