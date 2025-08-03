const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_kFcdD1WGpJ5n@ep-super-dawn-adw7hca1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await sql('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result[0].current_time);
    
    // Test if tables exist
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();