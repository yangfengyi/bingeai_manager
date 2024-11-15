import { MessageCircleIcon, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getMessageCount } from './(components)/messages/message-query-action';
import { UserRecendMessages } from './(components)/messages/user-recend-messages';
import { LatestRegisteredUsers } from './(components)/user/latest-registered-users';
import { getUserCount } from './(components)/user/user-query-action';

// request comes in, at most once every 60 seconds.
export const revalidate = 60;

export default async function Dashboard() {
  const userCount = await getUserCount();
  const messageCount = await getMessageCount();

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
        <Card x-chunk='dashboard-01-chunk-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>用户量</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userCount?.count || 0}</div>
            <p className='text-xs text-muted-foreground'>
              {/* +20.1% from last month */}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk='dashboard-01-chunk-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              用户使用消息数据
            </CardTitle>
            <MessageCircleIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{messageCount?.count || 0}</div>
            <p className='text-xs text-muted-foreground'></p>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <LatestRegisteredUsers />

        <UserRecendMessages />
      </div>
    </>
  );
}
