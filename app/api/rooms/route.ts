import { NextRequest, NextResponse } from 'next/server';
import { getRoomList } from '@/lib/room-query-action'; // 确保路径正确

export async function GET(request: NextRequest) {
  try {
    // 获取URL查询参数
    const searchParams = request.nextUrl.searchParams;

    // 解析查询参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const userEmail = searchParams.get('userEmail') || undefined;
    const startTime = searchParams.get('startTime')
      ? new Date(searchParams.get('startTime')!)
      : undefined;
    const endTime = searchParams.get('endTime')
      ? new Date(searchParams.get('endTime')!)
      : undefined;
    const mode = searchParams.get('mode') || undefined;

    // 调用数据库查询函数
    const result = await getRoomList({
      page,
      pageSize,
      userEmail,
      startTime,
      endTime,
      mode,
    });

    // 返回成功响应
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);

    // 返回错误响应
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
