const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log("Connected to Neon DB");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        branch VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created users table");

    // Insert default users if table is empty
    const { rows } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO users (username, password, name, role, branch) VALUES
        ('admin', '123', 'Super Admin', 'admin', 'HO'),
        ('staff', '123', 'Budi Santoso', 'staff', 'JKT-01'),
        ('spv', '123', 'Susi Susanti', 'spv', 'JKT-01'),
        ('marcom', '123', 'Andi Marcom', 'marcom', 'HO');
      `);
      console.log("Inserted default users");
    }

    // Create reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(50) PRIMARY KEY,
        sku VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        qty INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        damage_type VARCHAR(255),
        notes TEXT,
        photos JSONB DEFAULT '[]'::jsonb,
        time VARCHAR(100) NOT NULL,
        timestamp BIGINT NOT NULL
      );
    `);
    console.log("Created reports table");

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
