'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

// 定义模式类型和选项
const ROOM_MODES = {
  ALL: 'all',
  CHAT_WITH_VIDEO: 'CHAT_WITH_VIDEO',
  CHAT_ONLY: 'CHAT_ONLY',
} as const;

type RoomMode = (typeof ROOM_MODES)[keyof typeof ROOM_MODES];

export default function RoomFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('userEmail') || '');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [mode, setMode] = useState<RoomMode>(
    (searchParams.get('mode') as RoomMode) || ROOM_MODES.ALL
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    // 更新邮箱参数
    if (email) {
      params.set('userEmail', email);
    } else {
      params.delete('userEmail');
    }

    // 更新日期参数
    if (startDate) {
      params.set('startTime', startDate.toISOString());
    } else {
      params.delete('startTime');
    }

    if (endDate) {
      params.set('endTime', endDate.toISOString());
    } else {
      params.delete('endTime');
    }

    // 更新模式参数
    if (mode && mode !== ROOM_MODES.ALL) {
      params.set('mode', mode);
    } else {
      params.delete('mode');
    }

    // 重置页码
    params.set('page', '1');

    router.push(`/rooms?${params.toString()}`);
  };

  const handleReset = () => {
    setEmail('');
    setStartDate(undefined);
    setEndDate(undefined);
    setMode(ROOM_MODES.ALL);
    router.push('/rooms');
  };

  return (
    <div className='flex flex-col space-y-4 mb-6'>
      <div className='flex flex-row space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
        <Input
          placeholder='Search by email...'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='max-w-[320px]'
        />

        <Select
          value={mode}
          onValueChange={(value: RoomMode) => setMode(value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select mode' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ROOM_MODES.ALL}>All Modes</SelectItem>
            <SelectItem value={ROOM_MODES.CHAT_WITH_VIDEO}>
              Chat with Video
            </SelectItem>
            <SelectItem value={ROOM_MODES.CHAT_ONLY}>Chat Only</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-[180px]'>
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? format(startDate, 'PP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-[180px]'>
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? format(endDate, 'PP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleSearch}>Search</Button>
        <Button variant='outline' onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
