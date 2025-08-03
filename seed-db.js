const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_kFcdD1WGpJ5n@ep-super-dawn-adw7hca1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Create sample users
    const users = await sql`
      INSERT INTO users (clerk_id, email, first_name, last_name, phone, is_host)
      VALUES 
        ('user_1', 'john@example.com', 'John', 'Doe', '+1234567890', true),
        ('user_2', 'jane@example.com', 'Jane', 'Smith', '+1234567891', true),
        ('user_3', 'bob@example.com', 'Bob', 'Johnson', '+1234567892', false)
      ON CONFLICT (clerk_id) DO NOTHING
      RETURNING id, first_name, last_name
    `;
    
    console.log('✅ Created users:', users.length);
    
    // Get user IDs for equipment creation
    const allUsers = await sql`SELECT id, first_name FROM users LIMIT 3`;
    
    if (allUsers.length >= 2) {
      // Create sample equipment
      // Create mobility scooters
      const scooters = await sql`
        INSERT INTO equipment (
          host_id, title, description, equipment_type, scooter_subtype, 
          brand, model, daily_price, location, latitude, longitude,
          features, images, is_verified, is_active
        )
        VALUES 
          (
            ${allUsers[0].id}, 
            'Lightweight Mobility Scooter', 
            'Perfect for indoor and outdoor use. Lightweight and easy to transport.',
            'mobility_scooter',
            'lightweight',
            'Pride',
            'Go-Go Elite',
            45.00,
            'New York, NY',
            40.7128,
            -74.0060,
            '{"Lightweight", "Foldable", "LED Lights"}',
            '{"https://example.com/scooter1.jpg"}',
            true,
            true
          ),
          (
            ${allUsers[0].id},
            'Heavy Duty Scooter',
            'Robust scooter for outdoor adventures and longer trips.',
            'mobility_scooter',
            'heavy_duty',
            'Golden',
            'Buzzaround XLS',
            65.00,
            'Chicago, IL',
            41.8781,
            -87.6298,
            '{"Heavy duty", "Long range", "Comfortable seat"}',
            '{"https://example.com/scooter2.jpg"}',
            true,
            true
          )
        ON CONFLICT DO NOTHING
        RETURNING id, title
      `;
      
      // Create baby strollers
      const strollers = await sql`
        INSERT INTO equipment (
          host_id, title, description, equipment_type, stroller_subtype, 
          brand, model, daily_price, location, latitude, longitude,
          features, images, is_verified, is_active
        )
        VALUES 
          (
            ${allUsers[1].id},
            'Double Baby Stroller',
            'Spacious double stroller perfect for twins or siblings.',
            'baby_stroller',
            'double',
            'Baby Jogger',
            'City Mini GT2',
            35.00,
            'Los Angeles, CA', 
            34.0522,
            -118.2437,
            '{"All-terrain", "Quick-fold", "Large canopy"}',
            '{"https://example.com/stroller1.jpg"}',
            true,
            true
          )
        ON CONFLICT DO NOTHING
        RETURNING id, title
      `;
      
      const equipment = [...scooters, ...strollers];
      
      console.log('✅ Created equipment:', equipment.length);
      
      // Create availability for the next 30 days
      if (equipment.length > 0) {
        const today = new Date();
        const availabilityData = [];
        
        for (const item of equipment) {
          for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            availabilityData.push({
              equipment_id: item.id,
              date: date.toISOString().split('T')[0],
              is_available: true
            });
          }
        }
        
        // Insert availability in batches
        for (const avail of availabilityData) {
          await sql`
            INSERT INTO availability (equipment_id, date, is_available)
            VALUES (${avail.equipment_id}, ${avail.date}, ${avail.is_available})
            ON CONFLICT (equipment_id, date) DO NOTHING
          `;
        }
        
        console.log('✅ Created availability records:', availabilityData.length);
      }
    }
    
    // Verify the data
    const equipmentCount = await sql`SELECT COUNT(*) as count FROM equipment`;
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const availabilityCount = await sql`SELECT COUNT(*) as count FROM availability`;
    
    console.log('\n📊 Database Summary:');
    console.log(`  - Users: ${userCount[0].count}`);
    console.log(`  - Equipment: ${equipmentCount[0].count}`);
    console.log(`  - Availability records: ${availabilityCount[0].count}`);
    
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    console.error('Full error:', error);
  }
}

seedDatabase();