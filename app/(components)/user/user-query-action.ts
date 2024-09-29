'use server';

import pool from '@/lib/db';

export async function getUserCount() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM "user"');
      return { count: parseInt(result.rows[0].count) };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get user count:', error);
    return { error: 'Failed to get user count' };
  }
}

export async function getAllUsers() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, email, first_name, last_name, disabled, 
               created_at, updated_at, rid, credit, invite_code 
        FROM "user"
        ORDER BY created_at DESC
      `);
      return { users: result.rows };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get all user:', error);
    return { error: 'Failed to get all user' };
  }
}

export async function getLatestUsers() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, email, first_name, last_name, disabled, 
               created_at, updated_at, rid, credit, invite_code 
        FROM "user"
        ORDER BY created_at DESC
        LIMIT 5
      `);
      return { users: result.rows };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to get latest users:', error);
    return { error: 'Failed to get latest users' };
  }
}
