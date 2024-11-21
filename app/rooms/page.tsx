import { Suspense } from 'react';
import RoomList from '../(components)/rooms/room-list';
import RoomFilters from '../(components)/rooms/room-filters';
import { Card } from '@/components/ui/card';

export default function RoomsPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='flex flex-col space-y-4'>
        <Card className='p-4'>
          <RoomFilters />
          <Suspense fallback={<div>Loading...</div>}>
            <RoomList />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
