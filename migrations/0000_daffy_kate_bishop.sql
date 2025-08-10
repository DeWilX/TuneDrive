CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "click_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"element" text NOT NULL,
	"page_name" text NOT NULL,
	"element_text" text,
	"target_url" text,
	"session_id" text,
	"ip_address" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"subtitle" text,
	"icon" text NOT NULL,
	"bg_color" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"vehicle_details" text,
	"service_required" text NOT NULL,
	"additional_info" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "geo_locations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" text NOT NULL,
	"country" text,
	"country_code" text,
	"city" text,
	"region" text,
	"latitude" text,
	"longitude" text,
	"timezone" text,
	"isp" text,
	"last_seen" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"native_name" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_name" varchar NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"content" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "page_content_page_name_unique" UNIQUE("page_name")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_name" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"country" text,
	"city" text,
	"session_id" text,
	"referrer" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "power_calculator_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text NOT NULL,
	"features" jsonb NOT NULL,
	"button_text" text DEFAULT 'Check Your Vehicle Power' NOT NULL,
	"background_image" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"image" text,
	"features" jsonb NOT NULL,
	"price" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_identity" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logo_url" varchar,
	"favicon_url" varchar,
	"hero_image_url" varchar,
	"primary_color" varchar DEFAULT '#3b82f6',
	"secondary_color" varchar DEFAULT '#1e40af',
	"accent_color" varchar DEFAULT '#f59e0b',
	"background_color" varchar DEFAULT '#000000',
	"text_color" varchar DEFAULT '#ffffff',
	"company_name" varchar DEFAULT 'ChipTuning PRO',
	"tagline" varchar,
	"hero_title" varchar,
	"hero_subtitle" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar NOT NULL,
	"language" varchar NOT NULL,
	"value" text NOT NULL,
	"section" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicle_selections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_type" text NOT NULL,
	"brand" text NOT NULL,
	"model" text,
	"generation" text,
	"engine" text,
	"variant" text,
	"session_id" text,
	"ip_address" text,
	"country" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"generation" text NOT NULL,
	"engine" text NOT NULL,
	"variant" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"original_power" integer NOT NULL,
	"original_torque" integer NOT NULL,
	"stage1_power" integer NOT NULL,
	"stage1_torque" integer NOT NULL,
	"stage2_power" integer,
	"stage2_torque" integer
);
