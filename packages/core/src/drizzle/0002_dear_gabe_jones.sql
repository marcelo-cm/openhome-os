CREATE TYPE "public"."item_category" AS ENUM('clothing', 'device', 'home', 'furniture', 'personal');--> statement-breakpoint
CREATE TYPE "public"."item_privacy" AS ENUM('private', 'home_visible', 'public');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('draft', 'active', 'archived', 'lost', 'donated', 'sold', 'other');--> statement-breakpoint
CREATE TABLE "clothing_details" (
	"item_id" text PRIMARY KEY NOT NULL,
	"size" text,
	"material" text,
	"care_instructions" text
);
--> statement-breakpoint
CREATE TABLE "device_details" (
	"item_id" text PRIMARY KEY NOT NULL,
	"serial_number" text,
	"model_number" text,
	"warranty_expiration" date
);
--> statement-breakpoint
CREATE TABLE "furniture_details" (
	"item_id" text PRIMARY KEY NOT NULL,
	"dimensions" jsonb
);
--> statement-breakpoint
CREATE TABLE "home_item_details" (
	"item_id" text PRIMARY KEY NOT NULL,
	"model_number" text,
	"warranty_expiration" date
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp (3) with time zone,
	"category" "item_category" NOT NULL,
	"principal_id" text NOT NULL,
	"location_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"brand" text,
	"base_color" text,
	"notes" text,
	"purchase_price" numeric(8, 2),
	"purchase_date" date,
	"status" "item_status" DEFAULT 'active' NOT NULL,
	"privacy" "item_privacy" DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_item_details" (
	"item_id" text PRIMARY KEY NOT NULL,
	"material" text,
	"replacement_cycle_days" integer
);
--> statement-breakpoint
ALTER TABLE "clothing_details" ADD CONSTRAINT "clothing_details_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_details" ADD CONSTRAINT "device_details_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "furniture_details" ADD CONSTRAINT "furniture_details_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "home_item_details" ADD CONSTRAINT "home_item_details_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_principal_id_users_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_item_details" ADD CONSTRAINT "personal_item_details_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_memberships" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "organization_memberships" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "project_memberships" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "user_rbac_roles" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";