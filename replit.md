# ChipTuning PRO - Professional ECU Tuning Service

## Overview
ChipTuning PRO is a professional automotive ECU tuning and performance enhancement service website. It enables customers to check vehicle power specifications, explore tuning services, and request consultations. The application features a comprehensive vehicle database with power specifications and detailed service offerings, including Stage 1/2 chiptuning, EGR/DPF removal, and the ZBOX tuning device. The website is fully GDPR compliant, with robust privacy features including cookie consent management. The business vision is to provide a comprehensive, user-friendly platform for vehicle performance enhancement, targeting the automotive tuning market.

## User Preferences
Preferred communication style: Simple, everyday language.
Admin interface requirement: User-friendly for non-technical users with visual editors and drag-and-drop functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Styling**: Tailwind CSS with a dark theme design system.
- **UI Components**: Radix UI primitives and shadcn/ui.
- **State Management**: TanStack React Query.
- **Routing**: Wouter.
- **Forms**: React Hook Form with Zod validation.
- **Rich Text Editing**: ReactQuill with dark theme.
- **Drag & Drop**: @dnd-kit for navigation menu reordering.

### Backend Architecture
- **Server**: Express.js with TypeScript.
- **Data Layer**: Drizzle ORM with PostgreSQL.
- **API Design**: RESTful endpoints for vehicle data and contact requests.
- **Storage Pattern**: Interface-based storage abstraction.

### Database Schema
- **Vehicles Table**: Stores vehicle specifications (brand, model, variant, original power/torque, tuning improvements).
- **Contact Requests Table**: Handles customer inquiry form submissions.
- **Data Organization**: Supports multiple vehicle types (car, truck, tractor) with hierarchical brand/model/variant structure.

### Key Features
- **Power Checker**: Interactive vehicle selector for real-time power specifications.
- **Service Catalog**: Comprehensive tuning service descriptions.
- **Contact System**: Form-based customer inquiry handling with service-specific routing.
- **Responsive Design**: Mobile-first approach with WhatsApp integration.
- **Admin Dashboard**: Complete content management system for non-technical users.
- **Visual Content Editor**: WYSIWYG editor with live preview.
- **Drag & Drop Navigation**: Intuitive navigation menu management.
- **Vehicle Database**: Comprehensive CRUD system for managing vehicle specifications.
- **Translation System**: Multilingual support with translation management (Latvian default).
- **User Management**: Secure JWT-based authentication for admin access.
- **Help System**: Floating help panel with contextual tips.
- **GDPR Compliance**: Cookie consent banner, privacy policy, and data protection features.
- **Fully Editable Content**: All main page sections (Hero, Services, ZBox, Why Choose Us) are editable via the admin panel.

### Development Architecture
- **Monorepo Structure**: Shared schema definitions between client and server.
- **Hot Reload**: Vite integration with Express for development.
- **Type Safety**: End-to-end TypeScript with shared type definitions.
- **Build Process**: Separate client and server builds with static file serving.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.
- **Neon Database**: Cloud PostgreSQL service.

### UI and Styling
- **Radix UI**: Accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide Icons**: Icon library.

### Development Tools
- **Vite**: Frontend build tool.
- **Drizzle Kit**: Database migration and schema management.
- **ESBuild**: Server-side bundling.

### External Services
- **WhatsApp Business**: Direct customer communication.
- **CareEcu API**: Vehicle data integration for brands, models, years, and stages.
- **JVK Pro**: Comprehensive vehicle database integration.
- **Replit Platform**: Development environment.
- **CDN Resources**: Google Fonts (Inter) and Font Awesome icons.

### Validation and Forms
- **Zod**: Runtime type validation.
- **React Hook Form**: Form state management.
- **Drizzle-Zod**: Automatic schema validation from database definitions.