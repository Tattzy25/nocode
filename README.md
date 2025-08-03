# Scoovio - Mobility Equipment Rental Marketplace

A peer-to-peer rental marketplace for mobility scooters and baby strollers, built with Next.js 14, TypeScript, and modern cloud technologies.

## 🚀 Production-Ready Features

- **Equipment Listing Creation**: Hosts can create detailed listings for mobility scooters and baby strollers
- **Advanced Search Filters**: Search by equipment type, specifications, price, location, and features
- **Booking Management**: Complete booking system with availability tracking
- **Calendar Integration**: Real-time availability management for hosts
- **Messaging System**: Secure communication between guests and hosts
- **Document Management**: Equipment verification and document storage with AWS S3

## 🛠️ Production Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend & Database
- **Neon PostgreSQL** - Serverless database
- **Drizzle ORM** - Type-safe database toolkit
- **Vercel Serverless Functions** - API routes
- **Clerk** - Authentication & user management

### File Storage
- **AWS S3** - Document and image storage
- **CloudFront CDN** - Fast content delivery

### Deployment
- **Vercel** - Frontend and API deployment
- **Neon** - Database hosting
- **AWS** - Storage and CDN

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon)
- Clerk account
- AWS account with S3 bucket

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd scoovio
npm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.local.template .env.local
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

#### Create Database Schema
```bash
# Run migrations
npx drizzle-kit push:pg
```

#### Manual Setup
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Run the SQL schema from `lib/db/schema.sql`
3. Set your DATABASE_URL in .env.local

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Database Schema
- **users**: User profiles and authentication
- **equipment**: Equipment listings with full specifications
- **bookings**: Rental bookings with status tracking
- **availability**: Calendar availability management
- **messages**: Secure messaging between users
- **reviews**: Equipment reviews and ratings
- **equipment_documents**: Verification documents and AWS S3 integration

### API Routes
- `/api/equipment` - Equipment CRUD operations
- `/api/bookings` - Booking management system
- `/api/availability` - Calendar integration
- `/api/messages` - Secure messaging system
- `/api/search` - Advanced search with filters
- `/api/documents` - Document management (AWS S3)

## 🚀 Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Database Deployment (Neon)

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string to DATABASE_URL
3. Run database migrations: `npx drizzle-kit push:pg`

### 3. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure redirect URLs in Clerk Dashboard
3. Copy keys to environment variables

### 4. AWS S3 Setup

1. Create an S3 bucket
2. Set up IAM user with S3 permissions
3. Configure CORS settings for the bucket
4. Copy credentials to environment variables

## 📊 Database Commands

### Generate Migrations
```bash
npx drizzle-kit generate:pg
```

### Push to Database
```bash
npx drizzle-kit push:pg
```

### Studio (Database GUI)
```bash
npx drizzle-kit studio
```

## 🔧 Development Examples

### Adding New Equipment
```typescript
const response = await fetch('/api/equipment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Premium Lightweight Mobility Scooter",
    description: "Perfect for travel and daily use",
    equipment_type: "mobility_scooter",
    scooter_subtype: "lightweight",
    brand: "Drive Medical",
    model: "Scout",
    year: 2023,
    daily_price: 45.00,
    location: "Downtown Seattle",
    features: ["foldable", "lightweight", "long-battery"],
    images: ["https://..."]
  })
});
```

### Advanced Search
```typescript
const response = await fetch('/api/search?equipment_type=mobility_scooter&min_price=20&max_price=100&location=Seattle');
const results = await response.json();
```

### Booking Management
```typescript
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    equipment_id: "uuid-here",
    start_date: "2024-01-15",
    end_date: "2024-01-20",
    guest_message: "Looking forward to renting this!"
  })
});
```

## 🔐 Authentication

Protected routes use Clerk middleware with:
- User registration/login
- Profile management
- Host verification
- Secure API access

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design
- Tablet optimization
- Desktop experience
- Progressive Web App (PWA) ready

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📈 Monitoring

- **Vercel Analytics** - Performance monitoring
- **Clerk Analytics** - User analytics
- **Database Monitoring** - Neon dashboard
- **Error Tracking** - Vercel logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details