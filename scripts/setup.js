const fs = require('fs');
const path = require('path');

console.log('🚀 Scoovio Production Setup');
console.log('='.repeat(50));

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envTemplatePath = path.join(process.cwd(), '.env.local.template');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env.local from template...');
  if (fs.existsSync(envTemplatePath)) {
    fs.copyFileSync(envTemplatePath, envPath);
    console.log('✅ .env.local created successfully!');
    console.log('⚠️  Please update the environment variables in .env.local before proceeding.');
  } else {
    console.log('❌ .env.local.template not found. Please create .env.local manually.');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check package.json scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('\n📦 Available Scripts:');
console.log('- npm run dev: Start development server');
console.log('- npm run build: Build for production');
console.log('- npm run seed: Seed database with sample data');
console.log('- npm run db:push: Push schema to database');
console.log('- npm run db:studio: Open database GUI');

console.log('\n🎯 Next Steps:');
console.log('1. Update your environment variables in .env.local');
console.log('   - DATABASE_URL: Your Neon database connection string');
console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key');
console.log('   - CLERK_SECRET_KEY: Your Clerk secret key');
console.log('   - NEXT_PUBLIC_CLERK_SIGN_IN_URL: /sign-in');
console.log('   - NEXT_PUBLIC_CLERK_SIGN_UP_URL: /sign-up');
console.log('   - AWS_ACCESS_KEY_ID: Your AWS access key');
console.log('   - AWS_SECRET_ACCESS_KEY: Your AWS secret key');
console.log('   - AWS_REGION: Your AWS region (e.g., us-west-2)');
console.log('   - AWS_S3_BUCKET_NAME: Your S3 bucket name');
console.log('   - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: Your Mapbox access token');
console.log('');
console.log('2. Run: npm run db:push (to create database tables)');
console.log('3. Run: npm run seed (to add sample data)');
console.log('4. Run: npm run dev (to start development server)');

console.log('\n🔗 Useful URLs:');
console.log('- Local development: http://localhost:3000');
console.log('- Database studio: http://localhost:4983 (after running db:studio)');
console.log('- Clerk dashboard: https://dashboard.clerk.com');
console.log('- Neon dashboard: https://console.neon.tech');

console.log('\n✨ Ready for production deployment!');