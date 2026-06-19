import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Total Visitors (all time)
    const [totalRows]: any = await pool.query('SELECT COUNT(*) as count FROM web_visitors');
    const totalVisitors = totalRows[0].count;

    // Visitors Today
    const [todayRows]: any = await pool.query(`
      SELECT COUNT(*) as count FROM web_visitors 
      WHERE DATE(created_at) = CURDATE()
    `);
    const todayVisitors = todayRows[0].count;

    // Visitors This Month
    const [monthRows]: any = await pool.query(`
      SELECT COUNT(*) as count FROM web_visitors 
      WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `);
    const monthVisitors = monthRows[0].count;

    // Unique Visitors (by IP address)
    const [uniqueRows]: any = await pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM web_visitors');
    const uniqueVisitors = uniqueRows[0].count;

    // Popular Pages (Top 5)
    const [popularPages]: any = await pool.query(`
      SELECT path, COUNT(*) as views 
      FROM web_visitors 
      GROUP BY path 
      ORDER BY views DESC 
      LIMIT 5
    `);

    // Visitors Over Time (Last 7 days)
    const [chartData]: any = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as visitors
      FROM web_visitors
      WHERE created_at >= DATE(NOW()) - INTERVAL 6 DAY
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // Recent Visitors (Last 10)
    const [recentVisitors]: any = await pool.query(`
      SELECT ip_address, path, created_at, user_agent 
      FROM web_visitors 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          total: totalVisitors,
          today: todayVisitors,
          month: monthVisitors,
          unique: uniqueVisitors
        },
        popularPages,
        chartData,
        recentVisitors
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
