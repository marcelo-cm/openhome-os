CREATE TABLE "item_images" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp (3) with time zone,
	"item_id" text NOT NULL,
	"url" text NOT NULL,
	"storage_path" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."item_category";--> statement-breakpoint
CREATE TYPE "public"."item_category" AS ENUM('personal', 'clothing', 'home', 'device', 'furniture');--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "category" SET DATA TYPE "public"."item_category" USING "category"::"public"."item_category";--> statement-breakpoint
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;