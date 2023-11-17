import mysql, { Pool, PoolOptions } from 'mysql2/promise';

export default class DatabaseConnection {
  private pool: Pool;
  private config = {
    host: 'blackthorntestdb.ctyurw8kiwbo.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'ShoppingCartDB',
  }

  constructor() {
    this.pool = mysql.createPool(this.config);
  }

  async executeQuery(sql: string, params?: any[]): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }
}