# ChipTuning PRO - Professional ECU Tuning Service

A professional automotive ECU tuning and performance enhancement service website with comprehensive vehicle database, multilingual support, and complete admin management system.

## Features

- **Vehicle Power Checker**: Interactive vehicle selector with real-time power specifications from CareEcu API
- **Comprehensive Vehicle Database**: Support for cars with detailed power specifications and tuning data
- **Multilingual Support**: Full translation system for Latvian, Russian, and English
- **Admin Dashboard**: Complete content management system for non-technical users
- **GDPR Compliance**: Cookie consent management and privacy features
- **Professional Design**: Modern, responsive design with dark theme
- **Contact Management**: Centralized contact information with quote form integration

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **React Query** for server state management
- **Wouter** for routing
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **JWT** authentication for admin access
- **CareEcu API** integration for vehicle data

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- PostgreSQL database
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chiptuning-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database_name
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name

# JWT Secret for Admin Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here

# CareEcu API Configuration
CARECU_API_KEY=CARECU_API
CARECU_API_BASE_URL=https://api.carecusoft.com

# Optional: Object Storage (if using file uploads)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your_bucket_id
PUBLIC_OBJECT_SEARCH_PATHS=/bucket/public
PRIVATE_OBJECT_DIR=/bucket/private
```

### 4. Database Setup

#### Option A: Using Neon Database (Recommended for Development)
1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string to your `.env` file

#### Option B: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database
3. Update the `.env` file with your local credentials

<<<<<<< HEAD
### 5. Initialize Database Schema and Data

#### Step 1: Push the database schema
=======
### 5. Initialize Database Schema

>>>>>>> 8dff3efa3d7a507486abce63cdb0a2891c194fbc
Push the database schema to your PostgreSQL database:

```bash
npm run db:push
```

This command will:
- Create all necessary tables
- Set up relationships
- Initialize the database structure

<<<<<<< HEAD
#### Step 2: Populate initial data
Run the migration to populate your database with initial content:

```bash
node run-migration.js
```

This migration will populate:
- **Site Identity**: Company branding, colors, and hero statistics
- **Navigation**: Main menu items with multilingual support
- **Services**: Complete service catalog (Stage 1/2 Chiptuning, EGR/DPF removal)
- **ZBOX Content**: Tuning device information with translations
- **Why Choose Us**: Features and workshop information
- **Contact Information**: Centralized contact details
- **Sample Vehicles**: Popular car models with power specifications
- **Admin Account**: Default admin user (username: `admin`, password: `admin123`)

**Important**: Change the default admin password immediately after first login for security.

=======
>>>>>>> 8dff3efa3d7a507486abce63cdb0a2891c194fbc
### 6. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database storage layer
│   ├── db.ts            # Database connection
│   └── auth.ts          # Authentication middleware
├── shared/               # Shared TypeScript definitions
│   └── schema.ts        # Database schema and types
├── migrations/          # Database migration files
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Admin Access

### Creating an Admin Account

1. Start the development server
2. Navigate to `/admin/login`
3. Use the registration form to create your admin account
4. The first registered user automatically becomes an admin

### Admin Features

- **Site Identity**: Logo, colors, and branding management
- **Navigation**: Menu structure and links
- **Content Management**: Hero section, services, and page content
- **Vehicle Database**: Add, edit, and manage vehicle specifications
- **Translation System**: Manage content in multiple languages
- **Contact Management**: Centralized contact information and forms
- **Analytics**: View site usage and visitor statistics

## API Integration

### CareEcu API

The project integrates with CareEcu API for vehicle data:

- **Base URL**: `https://api.carecusoft.com`
- **API Key**: Included in environment variables
- **Endpoints Used**:
  - Brands: `/en/v1/chiptuning`
  - Models: `/lv/v1/tuning/models/{brand_id}`
  - Years: `/lv/v1/tuning/years/{model_id}`
  - Stages: `/lv/v1/tuning/stages/{year_id}`

## Deployment

### Production Environment Variables

Ensure all environment variables are properly set in your production environment:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
CARECU_API_KEY=your_api_key
```

### Build for Production

```bash
npm run build
npm run start
```

### Recommended Hosting Platforms

- **Replit** (Current hosting)
- **Vercel** (Frontend + Serverless functions)
- **Railway** (Full-stack with PostgreSQL)
- **DigitalOcean App Platform**
- **Heroku** (with PostgreSQL add-on)

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check firewall and network settings

2. **API Integration Problems**
   - Verify CareEcu API key is valid
   - Check network connectivity
   - Review API rate limits

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

### Database Reset

If you need to reset the database:

```bash
npm run db:push --force
```

**Warning**: This will delete all existing data.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added multilingual support and translation system
- **v1.2.0** - Integrated CareEcu API and comprehensive vehicle database
- **v1.3.0** - Complete contact management system and admin panel enhancements

---

**ChipTuning PRO** - Professional automotive performance enhancement platform
