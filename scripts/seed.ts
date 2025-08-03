import { db } from '@/lib/db';
import { users, equipment, availability } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

const seedData = {
  users: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      clerk_id: 'user_2abc123def456',
      email: 'sarah.johnson@email.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '+1-555-0123',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b332-3fc7-4008-8083-102e1a8d8f4c?w=150&h=150&fit=crop&crop=face',
      is_host: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      clerk_id: 'user_3def456ghi789',
      email: 'mike.chen@email.com',
      first_name: 'Mike',
      last_name: 'Chen',
      phone: '+1-555-0456',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      is_host: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      clerk_id: 'user_4ghi789jkl012',
      email: 'emma.wilson@email.com',
      first_name: 'Emma',
      last_name: 'Wilson',
      phone: '+1-555-0789',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      is_host: true,
    },
  ],
  equipment: [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Premium Lightweight Mobility Scooter',
      description: 'Top-of-the-line Pride Go-Go Elite Traveller Plus with extended battery life. Perfect for theme parks, shopping, or daily use. Folds easily for transport and includes front basket and USB charging port.',
      equipment_type: 'mobility_scooter' as const,
      scooter_subtype: 'lightweight' as const,
      brand: 'Pride',
      model: 'Go-Go Elite Traveller Plus',
      year: 2023,
      daily_price: 45.00,
      location: 'Anaheim, CA - Near Disneyland',
      latitude: 33.8366,
      longitude: -117.9143,
      features: ['foldable', 'lightweight', 'long-range', 'usb-charging', 'front-basket', 'adjustable-seat'],
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Uppababy Vista V2 Double Stroller',
      description: 'Premium double stroller perfect for twins or siblings. Includes bassinet and toddler seat configurations. All-terrain wheels make it ideal for parks and city walks.',
      equipment_type: 'baby_stroller' as const,
      stroller_subtype: 'double' as const,
      brand: 'Uppababy',
      model: 'Vista V2',
      year: 2023,
      daily_price: 65.00,
      location: 'Anaheim, CA - Near Disneyland',
      latitude: 33.8366,
      longitude: -117.9143,
      features: ['all-terrain', 'travel-system', 'reversible-seat', 'large-basket', 'sun-canopy', 'adjustable-handle'],
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596461403969-0d8ccb5ef1c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589578236639-5593484f3315?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440003',
      host_id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Travel-Friendly Mobility Scooter',
      description: 'Compact and lightweight Drive Medical Scout scooter. Easy disassembly for car transport. Perfect for travel and daily activities. Includes adjustable swivel seat and headlight.',
      equipment_type: 'mobility_scooter' as const,
      scooter_subtype: 'lightweight' as const,
      brand: 'Drive Medical',
      model: 'Scout',
      year: 2022,
      daily_price: 35.00,
      location: 'Los Angeles, CA - Santa Monica',
      latitude: 34.0195,
      longitude: -118.4912,
      features: ['foldable', 'lightweight', 'disassembles', 'adjustable-seat', 'headlight', 'basket'],
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440004',
      host_id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Bugaboo Fox 3 Single Stroller',
      description: 'Premium all-terrain stroller with advanced suspension. Perfect for city walks and park adventures. Includes bassinet for newborns and reversible toddler seat.',
      equipment_type: 'baby_stroller' as const,
      stroller_subtype: 'single' as const,
      brand: 'Bugaboo',
      model: 'Fox 3',
      year: 2023,
      daily_price: 55.00,
      location: 'Los Angeles, CA - Santa Monica',
      latitude: 34.0195,
      longitude: -118.4912,
      features: ['all-terrain', 'travel-system', 'reversible-seat', 'large-basket', 'sun-canopy', 'shock-absorption'],
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596461403969-0d8ccb5ef1c3?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440005',
      host_id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Heavy-Duty Mobility Scooter',
      description: 'Golden Technologies Buzzaround XL with 350 lb weight capacity. Perfect for outdoor activities and longer distances. Includes full lighting package and suspension.',
      equipment_type: 'mobility_scooter' as const,
      scooter_subtype: 'heavy_duty' as const,
      brand: 'Golden Technologies',
      model: 'Buzzaround XL',
      year: 2023,
      daily_price: 55.00,
      location: 'San Diego, CA - Mission Beach',
      latitude: 32.7751,
      longitude: -117.2361,
      features: ['heavy-duty', 'long-range', 'full-suspension', 'lighting-package', 'large-basket', 'adjustable-seat'],
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440006',
      host_id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'City Mini GT2 Single Stroller',
      description: 'Popular lightweight stroller perfect for urban adventures. Quick-fold mechanism and all-terrain wheels. Suitable from birth with car seat adapter.',
      equipment_type: 'baby_stroller' as const,
      stroller_subtype: 'single' as const,
      brand: 'Baby Jogger',
      model: 'City Mini GT2',
      year: 2022,
      daily_price: 30.00,
      location: 'San Diego, CA - Mission Beach',
      latitude: 32.7751,
      longitude: -117.2361,
      features: ['lightweight', 'quick-fold', 'all-terrain', 'travel-system', 'sun-canopy', 'adjustable-handle'],
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596461403969-0d8ccb5ef1c3?w=800&h=600&fit=crop',
      ],
      is_verified: true,
    },
  ],
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.delete(availability);
    await db.delete(equipment);
    await db.delete(users);

    // Insert users
    console.log('👥 Seeding users...');
    for (const user of seedData.users) {
      await db.insert(users).values(user);
    }

    // Insert equipment
    console.log('🛴 Seeding equipment...');
    for (const item of seedData.equipment) {
      await db.insert(equipment).values(item);

      // Create availability for next 90 days
      const today = new Date();
      const availabilityData = [];
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip some random days to simulate real availability
        const isAvailable = Math.random() > 0.1; // 90% availability
        
        availabilityData.push({
          equipment_id: item.id,
          date: date.toISOString().split('T')[0],
          is_available: isAvailable,
        });
      }

      await db.insert(availability).values(availabilityData);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded ${seedData.users.length} users and ${seedData.equipment.length} equipment items`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };