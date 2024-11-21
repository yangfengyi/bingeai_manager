import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatHistoryDrawerProps {
  roomData?: {
    id: number;
    user: {
      email: string;
      first_name: string;
      last_name: string;
    };
    chats: Array<{
      id: number;
      content: string;
      created_at: string;
      sender_type: 'user' | 'role';
      role?: {
        role_name: string;
        avatar?: string;
      };
      user?: {
        email: string;
        first_name: string;
        last_name: string;
      };
    }>;
  };
}

export function ChatHistoryDrawer({ roomData }: ChatHistoryDrawerProps) {
  if (!roomData) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm'>
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className='w-[400px] sm:w-[540px] h-full'>
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
          <SheetDescription>
            Room #{roomData.id} - {roomData.user.email}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className='h-[calc(100vh-100px)] mt-4 pr-4'>
          <div className='flex flex-col space-y-4'>
            {roomData.chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-3 ${
                  chat.sender_type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {chat.sender_type === 'role' && (
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={chat.role?.avatar} />
                    <AvatarFallback>
                      {chat.role?.role_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex flex-col max-w-[80%] ${
                    chat.sender_type === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      chat.sender_type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className='text-sm'>{chat.content}</p>
                  </div>
                  <span className='text-xs text-muted-foreground mt-1'>
                    {chat.sender_type === 'user'
                      ? `${chat.user?.first_name} ${chat.user?.last_name}`
                      : chat.role?.role_name}{' '}
                    • {format(new Date(chat.created_at), 'HH:mm')}
                  </span>
                </div>
                {chat.sender_type === 'user' && (
                  <Avatar className='w-8 h-8'>
                    <AvatarFallback>
                      {chat.user?.first_name?.[0]?.toUpperCase()}
                      {chat.user?.last_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
