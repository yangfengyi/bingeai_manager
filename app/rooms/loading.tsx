import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='container mx-auto py-6'>
      <div className='flex flex-col space-y-4'>
        <Skeleton className='h-10 w-[200px]' />
        <Card className='p-4'>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
