import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getLatestUsers } from './user-query-action';

export async function LatestRegisteredUsers() {
  const users = await getLatestUsers();

  console.log(users);

  return (
    <Card className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
      <CardHeader className='flex flex-row items-center'>
        <div className='grid gap-2'>
          <CardTitle>用户</CardTitle>
          <CardDescription>最新注册的5个用户</CardDescription>
        </div>
        <Button asChild size='sm' className='ml-auto gap-1'>
          <Link href='/users'>
            查看所有
            <ArrowUpRight className='h-4 w-4' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className='text-right'>邀请码</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='flex items-center gap-2'>
                  <Avatar>
                    <AvatarImage src={user?.avatar} className='object-cover' />
                    <AvatarFallback>
                      {user.first_name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {user.last_name + ' ' + user.first_name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user?.created_at)}</TableCell>
                <TableCell className='text-right'>
                  {user?.invite_code}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
