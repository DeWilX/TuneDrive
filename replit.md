# ChipTuning PRO - Professional ECU Tuning Service

## Overview

ChipTuning PRO is a professional automotive ECU tuning and performance enhancement service website. It provides customers with the ability to check vehicle power specifications, explore tuning services, and request consultations. The application features a comprehensive vehicle database with power specifications for cars, trucks, and agricultural vehicles, along with detailed service offerings including Stage 1/2 chiptuning, EGR/DPF removal, and the ZBOX tuning device.

The website is fully GDPR compliant with comprehensive privacy features including cookie consent management, privacy policy, and data protection compliance.

## Recent Enhancements (January 2025)

### Power Checker Improvements - Car-Only System (Latest)
- **Removed Vehicle Type Selection**: Eliminated car/truck/tractor selector per user request - now focuses only on cars
- **Simplified Interface**: Streamlined power checker with direct brand selection without vehicle type confusion  
- **Fixed Engine Data Issue**: Resolved "engines.map is not a function" error with proper array validation
- **Consistent Data Flow**: Ensured engines always display correctly for the selected vehicle without cross-contamination
- **Better Error Handling**: Added robust data validation to prevent runtime crashes from API response variations
- **User-Focused Design**: Simplified interface reduces confusion and improves user experience for car tuning services

### CareEcu API Integration with Unified System - COMPLETE INTEGRATION
- **Updated API Endpoints**: Successfully integrated new CareEcu API endpoints with unified vehicle system
  - Brands: `https://api.carecusoft.com/en/v1/chiptuning?key=5c78cfd1ca4ff97888f564558177b3e7`
  - Models: `https://api.carecusoft.com/lv/v1/tuning/models/{brand_id}?key=5c78cfd1ca4ff97888f564558177b3e7`
  - Years: `https://api.carecusoft.com/lv/v1/tuning/years/{model_id}?key=5c78cfd1ca4ff97888f564558177b3e7`
  - Stages: `https://api.carecusoft.com/lv/v1/tuning/stages/{year_id}?key=5c78cfd1ca4ff97888f564558177b3e7`
- **Unified System Architecture**: CareEcu API contains all vehicle types (cars, trucks, tractors) in one unified system
- **Proper API Mapping**: Generations = Years, Engines = Stages from CareEcu API structure
- **Removed Vehicle Type Parameter**: No longer needed as CareEcu uses unified system for all vehicle types
- **Hybrid Data Architecture**: Successfully integrated CareEcu API (api.carecusoft.com) with fallback to comprehensive JVK Pro database
- **Real-time Vehicle Data**: Primary data source from CareEcu API using provided credentials (API Key: 5c78cfd1ca4ff97888f564558177b3e7, Language: lv)
- **Robust Fallback System**: Graceful fallback to static database when API is unavailable or fails authentication
- **Complete Power Checker Integration**: Full vehicle hierarchy (brands → models → generations/years → engines/stages → power data) working seamlessly
- **Professional Error Handling**: Comprehensive logging and error recovery ensures uninterrupted user experience
- **Database Migration Completed**: Successfully migrated from Replit Agent to full Replit environment with PostgreSQL integration
- **CareEcu API Engine Fix**: Resolved engine specification display issue where tuning stages (ECO, STAGE 1) were showing instead of actual engine specs ("3.0 V6 TDi"). Now extracts proper engine specifications from CareEcu API parent data structure.

## Recent Enhancements (January 2025)

### JVK Pro Integration - Comprehensive Brand Coverage (Latest)
- **Complete JVK Pro Integration**: Successfully extracted and integrated comprehensive vehicle database from JVK Pro calculator (https://calculate.jvkpro.com/en)
- **Massive Brand Expansion**: Expanded from 8 brands to 34 comprehensive brands covering the entire automotive spectrum
- **306 Professional Vehicles**: Comprehensive vehicle database with 306 vehicles covering all major manufacturers
- **Global Coverage**: Complete coverage including European (Audi, BMW, Mercedes-Benz, Volkswagen), American (Ford, Chevrolet, Cadillac), Asian (Toyota, Honda, Nissan, Hyundai), and Agricultural (John Deere, Case, Claas, Caterpillar) brands
- **Professional Integration**: Database now matches industry-standard JVK Pro calculator specifications with accurate generation years and engine specifications

### Admin Panel Vehicle Manager Fix
- **Authentication Issue Resolved**: Fixed 401 unauthorized errors when adding/editing vehicles in admin panel
- **Focus Input Problems Fixed**: Resolved input focus loss on every keystroke in vehicle forms
- **Database Integration**: Connected admin panel vehicle manager to main comprehensive vehicle database
- **Stable Form Components**: Implemented memoized VehicleForm component to prevent React re-rendering issues
- **Proper API Integration**: Added authenticated API requests with proper authorization headers for all admin vehicle operations

### Complete Main Page Content Management 
- **Hero Statistics**: Made statistics (client count, project count, experience years) fully editable through admin panel
- **Hero Background Integration**: Connected Site Identity hero image upload to actual hero section display
- **Comprehensive Content Analysis**: Documented editability status of all main page sections
- **Admin Panel Coverage**: All critical content sections now manageable through user-friendly admin interface

### Site Identity Management Enhanced
- **Live Color Preview**: Real-time visual preview showing how selected colors appear on the actual website
- **Professional Image Upload System**: Drag-and-drop file upload for logos, favicons, and hero images using object storage
- **Enhanced Color Picker**: Detailed descriptions for each color purpose (buttons, links, highlights, etc.)
- **Visual Feedback**: Current image previews with proper error handling and file size limits
- **User-friendly Interface**: Professional layout with clear instructions and upload tips

### Analytics System Improvements
- **Network Error Handling**: Geolocation feature now gracefully handles network failures and timeouts
- **Optional Location Tracking**: Location data collection made optional with proper fallbacks
- **Improved Stability**: Fixed runtime errors related to external API calls

## User Preferences

Preferred communication style: Simple, everyday language.
Admin interface requirement: User-friendly for non-technical users with visual editors and drag-and-drop functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with a dark theme design system
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: ReactQuill with dark theme integration for WYSIWYG content editing
- **Drag & Drop**: @dnd-kit for intuitive navigation menu reordering

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Data Layer**: Drizzle ORM with PostgreSQL database schema
- **API Design**: RESTful endpoints for vehicle data and contact requests
- **Storage Pattern**: Interface-based storage abstraction with in-memory implementation (ready for database migration)

### Database Schema
- **Vehicles Table**: Stores vehicle specifications including brand, model, variant, original power/torque, and tuning stage improvements
- **Contact Requests Table**: Handles customer inquiry form submissions with vehicle details and service requirements
- **Data Organization**: Supports multiple vehicle types (car, truck, tractor) with hierarchical brand/model/variant structure

### Key Features
- **Power Checker**: Interactive vehicle selector with real-time power specifications lookup
- **Service Catalog**: Comprehensive tuning service descriptions with pricing  
- **Contact System**: Form-based customer inquiry handling with service-specific routing
- **Responsive Design**: Mobile-first approach with WhatsApp integration for instant communication
- **Admin Dashboard**: Complete content management system with user-friendly interface designed for non-technical users
- **Visual Content Editor**: WYSIWYG editor with live preview showing exactly how changes appear on the website
- **Drag & Drop Navigation**: Intuitive navigation menu management with drag-and-drop reordering
- **Vehicle Database**: Comprehensive CRUD system for managing car, truck, and tractor specifications
- **Translation System**: Multilingual support with translation management interface and automatic translation capabilities (Latvian default)
- **User Management**: Secure JWT-based authentication system for admin access
- **Help System**: Floating help panel with contextual tips and guidance for all admin functions
- **GDPR Compliance**: Comprehensive privacy features including cookie consent banner, privacy policy, cookie management, and data protection features
- **Fully Editable Content**: All main page sections (Hero, Services, ZBox, Why Choose Us) are editable through admin panel with fallback content

### Development Architecture
- **Monorepo Structure**: Shared schema definitions between client and server
- **Hot Reload**: Vite integration with Express for development
- **Type Safety**: End-to-end TypeScript with shared type definitions
- **Build Process**: Separate client and server builds with static file serving

## External Dependencies

### Database
- **PostgreSQL**: Primary database for vehicle data and contact requests
- **Neon Database**: Cloud PostgreSQL service integration via `@neondatabase/serverless`

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Icon library with Font Awesome fallback for specific branding icons

### Development Tools
- **Vite**: Frontend build tool with React plugin and development server
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Server-side bundling for production builds

### External Services
- **WhatsApp Business**: Direct customer communication integration
- **Replit Platform**: Development environment with specific plugins for runtime error handling
- **CDN Resources**: Google Fonts (Inter) and Font Awesome icons

### Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with resolver integration
- **Drizzle-Zod**: Automatic schema validation from database definitions