'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface RoomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export function RoomPagination({
  currentPage,
  totalPages,
}: RoomPaginationProps) {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      return params.toString();
    },
    [searchParams]
  );

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // 显示的页码数量

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* 上一页 */}
        <PaginationItem>
          <PaginationPrevious
            href={
              currentPage > 1
                ? `/rooms?${createQueryString(currentPage - 1)}`
                : '#'
            }
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* 第一页 */}
        {getPageNumbers()[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={`/rooms?${createQueryString(1)}`}>
                1
              </PaginationLink>
            </PaginationItem>
            {getPageNumbers()[0] > 2 && <PaginationEllipsis />}
          </>
        )}

        {/* 页码 */}
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`/rooms?${createQueryString(page)}`}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 最后一页 */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <PaginationEllipsis />
            )}
            <PaginationItem>
              <PaginationLink href={`/rooms?${createQueryString(totalPages)}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* 下一页 */}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? `/rooms?${createQueryString(currentPage + 1)}`
                : '#'
            }
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
