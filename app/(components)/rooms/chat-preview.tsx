interface ChatPreviewProps {
  chats: any[];
}

export default function ChatPreview({ chats }: ChatPreviewProps) {
  if (!chats || chats.length === 0) {
    return <span className='text-gray-500'>No messages</span>;
  }

  const latestChat = chats[chats.length - 1];
  return (
    <div className='max-w-md truncate'>
      <span className='text-sm'>
        {latestChat.sender_type === 'user'
          ? latestChat.user?.email
          : latestChat.role?.role_name}
        : {latestChat.content}
      </span>
    </div>
  );
}
