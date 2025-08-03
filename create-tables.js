const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const sql = neon('postgresql://neondb_owner:npg_kFcdD1WGpJ5n@ep-super-dawn-adw7hca1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function createTables() {
  try {
    console.log('🚀 Creating database tables...');
    
    // Read the SQL schema file
    const schemaSQL = fs.readFileSync('./lib/db/schema.sql', 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      try {
        await sql(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️  Already exists:', statement.substring(0, 50) + '...');
        } else {
          console.error('❌ Error executing:', statement.substring(0, 50) + '...');
          console.error('Error:', error.message);
        }
      }
    }
    
    // Verify tables were created
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Database tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    console.log('\n✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

createTables();