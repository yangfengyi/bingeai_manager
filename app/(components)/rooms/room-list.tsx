'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ChatPreview from './chat-preview';
import { format } from 'date-fns';
import { ChatHistoryDrawer } from './chat-history-drawer';
import { RoomPagination } from './room-pagination';

interface Room {
  id: number;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  mode: string;
  created_at: string;
  chats: any[];
}

export default function RoomList() {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        const response = await fetch(`/api/rooms?${params.toString()}`);
        const data = await response.json();
        setRooms(data.records);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Latest Chat</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.id}</TableCell>
              <TableCell>
                <div className='flex flex-col'>
                  <span>{room.user.email}</span>
                  <span className='text-sm text-gray-500'>
                    {room.user.first_name} {room.user.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{room.mode}</TableCell>
              <TableCell>{format(new Date(room.created_at), 'PP')}</TableCell>
              <TableCell>
                <ChatPreview chats={room.chats} />
              </TableCell>
              <TableCell>
                <ChatHistoryDrawer roomData={room} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RoomPagination
        currentPage={pagination.current}
        totalPages={Math.ceil(pagination.total / pagination.pageSize)}
        pageSize={pagination.pageSize}
      />
    </div>
  );
}
