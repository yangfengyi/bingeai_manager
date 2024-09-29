import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getLatestUserMessages } from './message-query-action';

export async function UserRecendMessages() {
  const messages = await getLatestUserMessages();

  return (
    <Card x-chunk='dashboard-01-chunk-5'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          最新的用户消息
          <Button asChild size='sm' className='ml-auto gap-1'>
            <Link href='/messages'>
              查看所有
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='grid gap-8'>
        {messages?.messages?.map((message) => (
          <div className='flex items-center gap-4' key={message.id}>
            <div className='grid gap-1'>
              <p className='text-sm font-medium leading-none'>
                <span className='text-base font-bold'>
                  {message.last_name + ' ' + message.first_name + ' '}
                </span>
                询问 {message.role}
              </p>
              <p className='text-sm text-muted-foreground'>{message.content}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
