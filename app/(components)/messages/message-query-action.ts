'use server';

import pool from '@/lib/db';

export async function getMessageCount() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM "history"');
      return { count: parseInt(result.rows[0].count) };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get user count:', error);
    return { error: 'Failed to get user count' };
  }
}

export async function getLatestUserMessages(limit = 5) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT h.id, h.uid, u.email, u.first_name, u.last_name, 
              h.content, h.role, h.type,
              TO_CHAR(h.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
        FROM history h
        JOIN "user" u ON h.uid = u.id
        WHERE h.content IS NOT NULL AND h.content != ''
        ORDER BY h.created_at DESC
        LIMIT $1
      `,
        [limit]
      );

      return { messages: result.rows };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get latest user messages:', error);
    return { error: 'Failed to get latest user messages' };
  }
}

export async function getLatestChatHistory(limit = 10000) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT * FROM history ORDER BY id DESC LIMIT $1;
      `,
        [limit]
      );

      return { chatHistory: result.rows };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return { error: 'Failed to get chat history' };
  }
}
