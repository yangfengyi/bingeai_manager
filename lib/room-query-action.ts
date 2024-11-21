import pool from '@/lib/db';

interface RoomQueryParams {
  page?: number;
  pageSize?: number;
  mode?: string;
  userId?: number;
  userEmail?: string;
  startTime?: Date;
  endTime?: Date;
}

export async function getRoomList(params: RoomQueryParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    userId,
    userEmail,
    startTime,
    endTime,
    mode,
  } = params; // 添加userEmail解构

  try {
    const client = await pool.connect();
    try {
      const conditions = [];
      const values = [];
      let paramIndex = 1;

      if (mode) {
        conditions.push(`r.mode = $${paramIndex}`);
        values.push(mode);
        paramIndex++;
      }

      if (userId) {
        conditions.push(`r.user_id = $${paramIndex}`);
        values.push(userId);
        paramIndex++;
      }

      // 添加userEmail条件
      if (userEmail) {
        conditions.push(`u.email ILIKE $${paramIndex}`);
        values.push(`%${userEmail}%`); // 使用ILIKE进行模糊匹配，不区分大小写
        paramIndex++;
      }

      if (startTime) {
        conditions.push(`r.created_at >= $${paramIndex}`);
        values.push(startTime);
        paramIndex++;
      }

      if (endTime) {
        conditions.push(`r.created_at <= $${paramIndex}`);
        values.push(endTime);
        paramIndex++;
      }

      values.push(pageSize);
      values.push((page - 1) * pageSize);

      const whereClause =
        conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

      const query = `
        WITH filtered_rooms AS (
          SELECT 
            r.id,
            r.user_id,
            r.video_id,
            r.mode,
            r.created_at,
            r.updated_at,
            r.role_ids,
            u.email,
            u.first_name,
            u.last_name
          FROM room r
          LEFT JOIN "user" u ON r.user_id = u.id
          ${whereClause}
        ),
        room_data AS (
          SELECT 
            *,
            COUNT(*) OVER() as total_count
          FROM filtered_rooms
          ORDER BY created_at DESC
          LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        )
        SELECT 
          rd.*,
          (
            SELECT COALESCE(json_agg(
              json_build_object(
                'id', c.id,
                'sender', c.sender,
                'sender_type', c.sender_type,
                'receiver', c.receiver,
                'content', c.content,
                'created_at', c.created_at,
                'updated_at', c.updated_at,
                'video_seconds', c.video_seconds,
                'message_id', c.message_id,
                'role', (
                  SELECT CASE 
                    WHEN c.sender_type = 'role' THEN 
                      json_build_object(
                        'id', r.id,
                        'role_name', r.role_name,
                        'intro', r.intro,
                        'avatar', r.avatar
                      )
                    ELSE NULL
                  END
                  FROM role r
                  WHERE r.id = c.sender
                ),
                'user', (
                  SELECT CASE 
                    WHEN c.sender_type = 'user' THEN 
                      json_build_object(
                        'id', u.id,
                        'email', u.email,
                        'first_name', u.first_name,
                        'last_name', u.last_name
                      )
                    ELSE NULL
                  END
                  FROM "user" u
                  WHERE u.id = c.sender
                )
              )
            ), '[]'::json)
            FROM chat c
            WHERE c.room_id = rd.id
          ) as chats,
          (SELECT COUNT(*) FROM filtered_rooms) as total_count
        FROM room_data rd
      `;

      const result = await client.query(query, values);

      return {
        records: result.rows.map((row) => ({
          id: row.id,
          user_id: row.user_id,
          video_id: row.video_id,
          mode: row.mode,
          created_at: row.created_at,
          updated_at: row.updated_at,
          role_ids: row.role_ids,
          user: {
            id: row.user_id,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
          },
          chats: row.chats || [],
        })),
        pagination: {
          current: page,
          pageSize: pageSize,
          total: parseInt(result.rows[0]?.total_count || '0'),
        },
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get room list:', error);
    throw new Error('Failed to get room list');
  }
}
